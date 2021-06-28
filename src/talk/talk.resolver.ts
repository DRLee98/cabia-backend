import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'apollo-server-express';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { PUB_SUB, NEW_MESSAGE } from 'src/common/common.constants';
import { User } from 'src/users/entites/user.entity';
import {
  CreateChatRoomInput,
  CreateChatRoomOutput,
} from './dtos/create-chat-room.dto';
import {
  CreateMessageInput,
  CreateMessageOutput,
} from './dtos/create-message.dto';
import {
  EntranceChatRoomInput,
  EntranceChatRoomOutput,
} from './dtos/entrance-chat-room.dto';
import {
  ExitChatRoomInput,
  ExitChatRoomOutput,
} from './dtos/exit-chat-room.dto';
import {
  IsSecretChatRoomInput,
  IsSecretChatRoomOutput,
} from './dtos/is-secret-chat-room.dto';
import { ListenNewMessageInput } from './dtos/listen-new-message.dto';
import {
  ViewChatRoomInput,
  ViewChatRoomOutput,
} from './dtos/view-chat-room.dto';
import { ViewChatRoomsOutput } from './dtos/view-chat-rooms.dto';
import { ChatRoom } from './entites/chatRoom.entity';
import { Message } from './entites/message.entity';
import { TalkService } from './talk.service';

@Resolver((of) => ChatRoom)
export class ChatRoomResolver {
  constructor(
    private readonly talkService: TalkService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Role(['Any'])
  @Mutation((returns) => CreateChatRoomOutput)
  createChatRoom(
    @AuthUser() user: User,
    @Args('input') createChatRoomInput: CreateChatRoomInput,
  ): Promise<CreateChatRoomOutput> {
    return this.talkService.createChatRoom(user, createChatRoomInput);
  }

  @Role(['Any'])
  @Mutation((returns) => EntranceChatRoomOutput)
  entranceChatRoom(
    @AuthUser() user: User,
    @Args('input') entranceChatRoomInput: EntranceChatRoomInput,
  ): Promise<EntranceChatRoomOutput> {
    return this.talkService.entranceChatRoom(user, entranceChatRoomInput);
  }

  @Role(['Any'])
  @Mutation((returns) => ExitChatRoomOutput)
  exitChatRoom(
    @AuthUser() user: User,
    @Args('input') exitChatRoomInput: ExitChatRoomInput,
  ): Promise<ExitChatRoomOutput> {
    return this.talkService.exitChatRoom(user, exitChatRoomInput);
  }

  @Role(['Any'])
  @Query((returns) => ViewChatRoomOutput)
  viewChatRoom(
    @AuthUser() user: User,
    @Args('input') viewChatRoomInput: ViewChatRoomInput,
  ): Promise<ViewChatRoomOutput> {
    return this.talkService.viewChatRoom(user, viewChatRoomInput);
  }

  @Role(['Any'])
  @Query((returns) => ViewChatRoomsOutput)
  viewChatRooms(): Promise<ViewChatRoomsOutput> {
    return this.talkService.viewChatRooms();
  }

  @Role(['Any'])
  @Query((returns) => IsSecretChatRoomOutput)
  isSecretChatRoom(
    @Args('input') isSecretChatRoomInput: IsSecretChatRoomInput,
  ): Promise<IsSecretChatRoomOutput> {
    return this.talkService.isSecretChatRoom(isSecretChatRoomInput);
  }

  @Role(['Any'])
  @Subscription((returns) => Message, {
    filter(
      { listenNewMessage }: { listenNewMessage: Message },
      { input: { id } }: { input: ListenNewMessageInput },
      { user }: { user: User },
    ) {
      return (
        listenNewMessage.chatRoom.id === id &&
        listenNewMessage.writer.id !== user.id
      );
    },
  })
  listenNewMessage(
    @Args('input') listenNewMessageInput: ListenNewMessageInput,
  ) {
    return this.pubSub.asyncIterator(NEW_MESSAGE);
  }
}

@Resolver((of) => Message)
export class MessageResolver {
  constructor(private readonly talkService: TalkService) {}

  @Role(['Any'])
  @Mutation((returns) => CreateMessageOutput)
  createMessage(
    @AuthUser() writer: User,
    @Args('input') createMessageInput: CreateMessageInput,
  ): Promise<CreateMessageOutput> {
    return this.talkService.createMessage(writer, createMessageInput);
  }
}
