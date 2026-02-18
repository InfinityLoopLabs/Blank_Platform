import {
  CreateRequestDto,
  RequestValidationPipe,
  ResponseFactory,
} from '@core/transport/http'
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
} from '@nestjs/common'

import { Response } from 'express'

import { HealthService } from '../../../../platform/modules/health/transport'
import {
  RequestWithContext,
  getRequestContext,
} from '../../../../platform/transport/http/context'
import { MiddlewareExceptionFilter } from '../../../../platform/transport/http/filters'
import {
  HttpAuthGuard,
  PolicyGuard,
  RequiredPolicy,
} from '../../../../platform/transport/http/guards'
import { TimingInterceptor } from '../../../../platform/transport/http/interceptors'
import { CreateSampleUseCase } from '../../application/create-sample.use-case'

@Controller('sample')
@UseFilters(MiddlewareExceptionFilter)
export class SamplesController {
  constructor(
    private readonly createSampleUseCase: CreateSampleUseCase,
    private readonly responseFactory: ResponseFactory,
    private readonly healthService: HealthService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequiredPolicy('sample:create')
  @UseGuards(HttpAuthGuard, PolicyGuard)
  @UseInterceptors(TimingInterceptor)
  async create(
    @Body(RequestValidationPipe) payload: CreateRequestDto,
    @Req() request: RequestWithContext,
    @Res({ passthrough: true }) response: Response
  ) {
    this.healthService.ensureWriteAllowed()

    const result = await this.createSampleUseCase.execute(payload)
    const context = getRequestContext(request)
    const output = this.responseFactory.created(
      'sample created',
      result,
      context
    )

    response.status(output.statusCode)

    return output.envelope
  }
}
