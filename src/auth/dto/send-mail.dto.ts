import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendMailDto {
  @ApiProperty({
    description: 'The email that we will send to',
    example: 'john@doe.com',
  })
  @IsEmail()
  email: string;
}
