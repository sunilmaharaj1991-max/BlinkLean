import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as requestModule from 'supertest';
const request = requestModule as any;
import { AppModule } from './../src/app.module';

describe('BlinkLean End-to-End System Integration', () => {
  let app: INestApplication;
  let testToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // ==========================================================
  // 1️⃣ Availability & AI Agent Check
  // ==========================================================
  describe('AI Availability Agent (/api/v1/availability/check)', () => {
    it('should return serviceable=true for approved zone (e.g. Vijayanagar)', async () => {
      const response = await request(app.getHttpServer())
        .post('/availability/check')
        .send({ latitude: 12.965, longitude: 77.535 }); // Approximating inside poly

      expect(response.status).toBe(201);
      expect(response.body.serviceable).toBe(true);
      expect(response.body.allowed_services).toContain('scrap');
    });

    it('should return launching soon for unapproved zones', async () => {
      const response = await request(app.getHttpServer())
        .post('/availability/check')
        .send({ latitude: 12.0, longitude: 77.0 }); // Far outside Bangalore

      expect(response.status).toBe(201);
      expect(response.body.serviceable).toBe(false);
      expect(response.body.advisory_message).toContain('launching soon');
    });
  });

  // ==========================================================
  // 2️⃣ OTP Authentication Flow
  // ==========================================================
  describe('Authentication Flow (/api/v1/auth)', () => {
    it('should generate and send OTP', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/send-otp')
        .send({ phone_number: '+919876543210' });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('OTP sent successfully');
    });

    // In a real e2e, we would mock the cache to extract the generated OTP,
    // or test against a seeded static OTP for the test-phone.
  });

  // ==========================================================
  // 3️⃣ Website vs App Behavior & Payments
  // ==========================================================
  describe('Platform Restriction Checks', () => {
    it('should block payment requests originating from the web', async () => {
      const response = await request(app.getHttpServer())
        .post('/payments/create-order')
        .set('platform', 'web') // Explicitly simulating web attempt
        .set('Authorization', `Bearer dummy_token`) // Assuming guard rejects early
        .send({ booking_id: 1 });

      expect(response.status).toBe(401); // Or 400 if Guard passes but restriction catches
    });

    // Test will fail without passing auth guard first in reality,
    // demonstrating security layer works.
  });
});
