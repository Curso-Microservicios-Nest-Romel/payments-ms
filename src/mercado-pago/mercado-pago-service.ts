/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { envs } from 'src/config'; // o usa process.env directamente

@Injectable()
export class MercadoPagoService {
  private mp: MercadoPagoConfig;
  private preference: Preference;

  constructor() {
    this.mp = new MercadoPagoConfig({
      accessToken: envs.MP_SECRET || 'TU_ACCESS_TOKEN',
    });

    this.preference = new Preference(this.mp);
  }

  async createPreference(data: {
    items: {
      id: string;
      title: string;
      quantity: number;
      unit_price: number;
      currency_id: string;
    }[];
    metada?: any;
  }) {
    const URL = 'https://q21sd0v1-3003.brs.devtunnels.ms';

    const preferenceData = {
      items: data.items,
      //   items: [
      //     {
      //       id: data.id,
      //       title: data.title,
      //       quantity: data.quantity,
      //       unit_price: data.price,
      //       currency_id: 'PEN',
      //     },
      //   ],
      back_urls: {
        success: envs.MP_SUCCESS_URL,
        failure: envs.MP_FAILURE_URL,
        pending: envs.MP_PENDING_URL,
      },
      //   auto_return: 'approved',
      metadata: data.metada,
      notification_url: `${URL}/payments/webhook`,
    };

    const response = await this.preference.create({ body: preferenceData });

    return response;
  }

  async getInfoPreference(id: string) {
    const response = await this.preference.get({ preferenceId: id });
    return response;
  }

  async getPaymentInfo(id: string) {
    const payment = new Payment(this.mp);
    const response = await payment.get({ id });
    return response;
  }

  // validateWebhookSignature(
  //   body: any,
  //   signature: string | undefined,
  // ): Promise<boolean> {
  //   // MercadoPago does not provide a validateSignature method in the SDK.
  //   // You need to implement signature validation based on your webhook secret and MercadoPago's documentation.
  //   // For now, just return true if signature exists (placeholder logic).
  //   // Replace this with actual validation as needed.
  //   if (!signature) {
  //     return false;
  //   }

  //   // TODO: Implement actual signature validation logic here.
  //   return true;
  // }
}
