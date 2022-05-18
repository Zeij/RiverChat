import { GroupMessage } from './../group/entity/groupMessage.entity';
import { Module } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Group, GroupMap } from '../group/entity/group.entity';
import { UserMap } from '../friend/entity/friend.entity';
import { FriendMessage } from '../friend/entity/friendMessage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Group,
      GroupMap,
      GroupMessage,
      UserMap,
      FriendMessage,
    ]),
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}
  //生命周期事件
  async onModuleInit() {
    const defaultGroup = await this.groupRepository.find({
      where: { groupName: '江河聊天室' },
    });
    if (!defaultGroup.length) {
      await this.groupRepository.save({
        groupId: '江河聊天室',
        groupName: '江河聊天室',
        userId: 'admin',
        createTime: new Date().valueOf(),
      });
      console.log('create default group 江河聊天室');
    }
  }
}
