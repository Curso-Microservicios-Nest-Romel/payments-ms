import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentSessionDto } from './dto/paymet-session.dto';
import { Request, Response } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  create(@Body() paymentSessionDto: PaymentSessionDto) {
    return this.paymentsService.create(paymentSessionDto);
  }

  @Get('success')
  findAll() {
    return {
      ok: true,
      message: 'Payment successful',
    };
  }

  @Get('cancel')
  findOne() {
    return {
      ok: false,
      message: 'Payment cancelled',
    };
  }

  @Post('webhook')
  async stripeWebhook(@Req() req: Request, @Res() res: Response) {
    return this.paymentsService.mpWebhook(req, res);
  }
}
