import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { Staff, StaffDocument } from 'src/schemas/staff.schema';

@Injectable()
export class StaffService {
  constructor(
    @InjectModel(Staff.name) private staffModel: Model<StaffDocument>,
  ) {}

  // ---------------- CREATE ----------------
  async create(createStaffDto: CreateStaffDto) {
    const staff = new this.staffModel(createStaffDto);
    return staff.save();
  }

  // ---------------- FIND ALL ----------------
  async findAll() {
    return this.staffModel.find().exec();
  }

  // ---------------- FIND ONE ----------------
  async findOne(id: string) {
    const staff = await this.staffModel.findById(id).exec();
    if (!staff) throw new NotFoundException('Staff introuvable');
    return staff;
  }

  // ---------------- UPDATE ----------------
  async update(id: string, updateStaffDto: UpdateStaffDto) {
    const staff = await this.staffModel.findByIdAndUpdate(
      id,
      updateStaffDto,
      { new: true },
    );
    if (!staff) throw new NotFoundException('Staff introuvable');
    return staff;
  }

  // ---------------- REMOVE ----------------
  async remove(id: string) {
    const result = await this.staffModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Staff introuvable');
    return { message: 'Staff supprimé avec succès', id };
  }



async addArbitreToAcademie(idAcademie: string, idArbitre: string) {
  // Cherche le staff par id_academie
  const staff = await this.staffModel.findOne({ id_academie: idAcademie }).exec();
  
  if (!staff) {
    throw new NotFoundException('Staff pour cette académie introuvable');
  }

  const arbitreObjectId = new Types.ObjectId(idArbitre);

  // Vérifie si l'arbitre est déjà dans la liste
  if (!staff.id_arbitres.some(a => a.equals(arbitreObjectId))) {
    staff.id_arbitres.push(arbitreObjectId);
    await staff.save();
  }

  return staff;
}

// ---------------- FIND ARBITRES BY ACADEMIE ----------------
async getArbitresByAcademie(idAcademie: string) {
  // Cherche le staff par id_academie et populate les arbitres
  const staff = await this.staffModel
    .findOne({ id_academie: idAcademie })
    .populate('id_arbitres') // Popule les infos complètes des arbitres depuis la collection User
    .exec();

  if (!staff) {
    throw new NotFoundException('Staff pour cette académie introuvable');
  }

  return staff.id_arbitres; // Retourne le tableau des arbitres
}
////////////////////////delete arbitre from academie///////////////////////
async removeArbitreFromAcademie(idAcademie: string, idArbitre: string) {
  // Cherche le staff par id_academie
  const staff = await this.staffModel.findOne({ id_academie: idAcademie }).exec();
  
  if (!staff) {
    throw new NotFoundException('Staff pour cette académie introuvable');
  }

  const arbitreObjectId = new Types.ObjectId(idArbitre);

  // Filtre : garde uniquement ceux QUI NE SONT PAS égaux
  staff.id_arbitres = staff.id_arbitres.filter(a => !a.equals(arbitreObjectId));

  await staff.save();

  return staff;
}

}
