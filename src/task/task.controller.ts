import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { TaskDto } from "./items/task.dto";
import { TaskService } from "./task.service";

@Controller('task')
export class TaskController {

  constructor(private readonly userService: TaskService) {
  }
  @Get()
  getAllUser(){
    return this.userService.getAll()
  }

  @Post()
  createUser(@Body() task:TaskDto){
    return this.userService.create(task)
  }

  @Put()
  updateUser(@Body() task: TaskDto){
    return this.userService.update(task)
  }

  @Delete(":id")
  deleteUser(@Param("id") id:string){
    return this.userService.delete(id)
  }
}
