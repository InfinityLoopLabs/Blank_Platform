import { Injectable, PipeTransform } from '@nestjs/common';

import { TransportError } from '../../common';

export type CreateRequestDto = {
  name: string;
  totalCents: number;
  isPriority: boolean;
};

@Injectable()
export class RequestValidationPipe implements PipeTransform<unknown, CreateRequestDto> {
  transform(raw: unknown): CreateRequestDto {
    const payload = raw as Partial<CreateRequestDto>;

    if (typeof payload.name !== 'string' || payload.name.trim() === '') {
      throw new TransportError('VALIDATION_ERROR', 'name is required');
    }
    if (typeof payload.totalCents !== 'number' || payload.totalCents <= 0) {
      throw new TransportError('VALIDATION_ERROR', 'totalCents must be greater than zero');
    }

    return {
      name: payload.name.trim(),
      totalCents: payload.totalCents,
      isPriority: Boolean(payload.isPriority),
    };
  }
}
