import { IsString, IsDate, IsNotEmpty, IsNumber, IsEnum, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  prenom: string;

  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  age: Date;

  @IsNumber()
  @IsNotEmpty()
  tel: number;

  @IsString()
  @IsNotEmpty()
  mdp: string;

  @IsEnum(['JOUEUR', 'OWNER', 'ARBITRE'])
  role: string;
}
