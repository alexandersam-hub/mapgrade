import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { GradeDto } from "./domains/grade.dto";
import { GradeService } from "./grade.service";

@Controller('grade')
export class GradeController {

  constructor(private readonly gradeService: GradeService) {
  }
  @Get()
  getAllUser(){
    return this.gradeService.getAll()
  }

  @Post()
  createUser(@Body() task:GradeDto){
    return this.gradeService.create(task)
  }

  @Put()
  updateUser(@Body() task: GradeDto){
    return this.gradeService.update(task)
  }

  @Delete(":id")
  deleteUser(@Param("id") id:string){
    return this.gradeService.delete(id)
  }
}
