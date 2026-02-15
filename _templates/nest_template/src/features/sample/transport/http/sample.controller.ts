import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { Response } from 'express';

import { CreateSampleUseCase } from '../../application/create-sample.use-case';
import { MiddlewareExceptionFilter } from '../../../../platform/transport/http/filters';
import { AuthGuard, PolicyGuard, RequiredPolicy } from '../../../../platform/transport/http/guards';
import { TimingInterceptor } from '../../../../platform/transport/http/interceptors';
import { RequestWithContext, getRequestContext } from '../../../../platform/transport/http/context';
import { CreateRequestDto, RequestValidationPipe } from '../../../../platform/transport/http/pipes';
import { ResponseFactory } from '../../../../platform/transport/http/response.factory';
import { HealthService } from '../../../../platform/modules/health/transport';

@Controller('sample')
@UseFilters(MiddlewareExceptionFilter)
export class SamplesController {
  constructor(
    private readonly createSampleUseCase: CreateSampleUseCase,
    private readonly responseFactory: ResponseFactory,
    private readonly healthService: HealthService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequiredPolicy('sample:create')
  @UseGuards(AuthGuard, PolicyGuard)
  @UseInterceptors(TimingInterceptor)
  async create(
    @Body(RequestValidationPipe) payload: CreateRequestDto,
    @Req() request: RequestWithContext,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.healthService.ensureWriteAllowed();

    const result = await this.createSampleUseCase.execute(payload);
    const context = getRequestContext(request);
    const output = this.responseFactory.created('sample created', result, context);

    response.status(output.statusCode);
    return output.envelope;
  }
}
