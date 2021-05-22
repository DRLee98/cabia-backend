import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entites/core.entity';
import { User } from 'src/users/entites/user.entity';
import { Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Message } from './message.entity';

@InputType('ChatRoomInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class ChatRoom extends CoreEntity {
  @ManyToMany((type) => User, (user) => user.chatRooms, {
    onDelete: 'SET NULL',
    eager: true,
  })
  @Field((type) => [User])
  users: User[];

  @OneToMany((type) => Message, (message) => message.chatRoom, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  @Field((type) => [Message], { nullable: true })
  messages?: Message[];
}