import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from 'mongoose';
import { TaskDto } from "./items/task.dto";

@Injectable()
export class TaskService {

  constructor(@InjectModel("task") readonly taskModel: Model<TaskDto>) {
  }
  async getAll(){
    return this.taskModel.find()
  }
  async geTaskById(id:string){
    const task = await this.taskModel.findById(id);
    if (task)
      return JSON.parse(JSON.stringify(task))
    return null
  }

  async create(task: TaskDto){
    const oldUser = await this.taskModel.findOne({username: task.title})
    if (oldUser){
      throw new BadRequestException('Пользоветль с указанным именем уже существует')
    }
    task.id = new mongoose.Types.ObjectId().toString()
    return this.taskModel.create(task)
  }

  async update(task: TaskDto){
    const oldTask = await this.taskModel.findById(task.id)
    if (!oldTask){
      throw new BadRequestException("Испытание не существует")
    }
    console.log(task)
      await this.taskModel.findByIdAndUpdate(task.id, task)
      return this.taskModel.findById(task.id)
  }

  async delete(taskId:string){
    return this.taskModel.findByIdAndRemove(taskId)
  }
}
