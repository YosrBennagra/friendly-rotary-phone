import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CvsService } from './cvs.service';
import { CreateCvDto, UpdateCvDto } from './dto/cv.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cvs')
@UseGuards(JwtAuthGuard)
export class CvsController {
  constructor(private readonly cvsService: CvsService) {}

  @Post()
  create(@Request() req, @Body() createCvDto: CreateCvDto) {
    return this.cvsService.create(req.user.id, createCvDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.cvsService.findAllByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.cvsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateCvDto: UpdateCvDto,
  ) {
    return this.cvsService.update(id, req.user.id, updateCvDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.cvsService.remove(id, req.user.id);
  }

  @Post(':id/duplicate')
  duplicate(@Param('id') id: string, @Request() req) {
    return this.cvsService.duplicate(id, req.user.id);
  }

  @Patch(':id/visibility')
  updateVisibility(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { isPublic: boolean },
  ) {
    return this.cvsService.updateVisibility(id, req.user.id, body.isPublic);
  }
}