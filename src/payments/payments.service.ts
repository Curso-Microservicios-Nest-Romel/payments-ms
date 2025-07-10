import { Injectable } from '@nestjs/common';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { MercadoPagoService } from '../mercado-pago/mercado-pago-service';
import { PaymentSessionDto } from './dto/paymet-session.dto';
import { Request, Response } from 'express';

@Injectable()
export class PaymentsService {
  constructor(private readonly mpService: MercadoPagoService) {}

  async create(paymentSessionDto: PaymentSessionDto) {
    const { currency, items, orderId } = paymentSessionDto;

    const lineItems = items.map((item) => {
      return {
        id: '1',
        unit_price: Math.round(item.price * 100),
        quantity: item.quantity,
        title: item.name,
        currency_id: currency,
      };
    });

    // async create() {
    const session = await this.mpService.createPreference({
      items: lineItems,
      metada: {
        orderId,
      },
    });

    return session;
  }

  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    console.log({ updatePaymentDto });
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }

  async mpWebhook(req: Request, res: Response) {
    try {
      // const type = req.query.type as string;
      const paymentId = req.query['data.id'] as string;

      console.log('Headers:', req.headers);
      console.log('Webhook Event:', { paymentId });
      console.log(req.query);

      // Validar tipo de evento
      if (!paymentId) {
        return res.status(400).json({
          ok: false,
          msg: 'Missing type or data.id in query',
        });
      }

      // Opcional: Verificar firma (si decides implementarlo)
      const signature = req.headers['x-signature'];
      console.log({ signature });
      const paymentDetails = await this.mpService.getPaymentInfo(paymentId);

      console.log({ paymentDetails });

      const status = paymentDetails.status;

      // Ejemplo de manejo según tipo
      switch (status) {
        case 'approved': {
          console.log('Detalles del pago aprobado:', paymentDetails);

          break;
        }
        case 'pending': {
          console.log('Detalles del pago pendiente:', paymentDetails);

          break;
        }
        case 'rejected': {
          console.log('Detalles del pago rechazado:', paymentDetails);

          break;
        }

        default:
          console.warn(`Unhandled event type: ${status}`);
          break;
      }

      return res.status(200).send('Webhook received');
    } catch (error) {
      console.error('Error in webhook:', error);
      return res
        .status(500)
        .json({ ok: false, error: 'Internal server error' });
    }
  }
}
