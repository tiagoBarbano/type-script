import 'reflect-metadata';
import { ApiModel, ApiModelProperty } from "@inversify-cn/swagger-express-ts";


@ApiModel({
  description: "User description",
  name: "User"
})
export class User {
  @ApiModelProperty({ description: "", required: true })
  nome_item: string;
  @ApiModelProperty({ description: "", required: true })
  num_item: number;

  constructor(num_item: number, nome_item: string) {
    this.num_item = num_item;
    this.nome_item = nome_item;
  }
}
