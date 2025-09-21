import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsObject, IsIn } from 'class-validator';

export class CreateCvDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsIn(['CLASSIC', 'MODERN', 'COMPACT'])
  template?: 'CLASSIC' | 'MODERN' | 'COMPACT';

  @IsOptional()
  @IsObject()
  theme?: any;

  @IsOptional()
  @IsObject()
  data?: any;
}

export class UpdateCvDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsIn(['CLASSIC', 'MODERN', 'COMPACT'])
  template?: 'CLASSIC' | 'MODERN' | 'COMPACT';

  @IsOptional()
  @IsObject()
  theme?: any;

  @IsOptional()
  @IsObject()
  data?: any;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}