import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RCode } from 'src/common/constant/rcode';
import { Repository } from 'typeorm';
import { UserMap } from './entity/friend.entity';
import { FriendMessage } from './entity/friendMessage.entity';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(UserMap)
    private readonly friendRepository: Repository<UserMap>,
    @InjectRepository(FriendMessage)
    private readonly friendMessageRepository: Repository<FriendMessage>,
  ) {}

  async getFriends(userId: string) {
    try {
      if (userId) {
        return {
          msg: '获取用户好友成功',
          data: await this.friendRepository.find({ where: { userId: userId } }),
        };
      } else {
        return {
          msg: '获取用户好友失败',
          data: await this.friendRepository.find(),
        };
      }
    } catch (e) {
      return { code: RCode.ERROR, msg: '获取用户好友失败', data: e };
    }
  }

  async getFriendMessages(
    userId: string,
    friendId: string,
    current: number,
    pageSize: number,
  ) {
    const messages = await this.friendMessageRepository
      .createQueryBuilder('friendMessage')
      .orderBy('friendMessage.time', 'DESC')
      .where(
        'friendMessage.userId = :userId AND friendMessage.friendId = :friendId',
        { userId: userId, friendId: friendId },
      )
      .orWhere(
        'friendMessage.userId = :friendId AND friendMessage.friendId = :userId',
        { userId: userId, friendId: friendId },
      )
      .skip(current)
      .take(pageSize)
      .getMany();
    return { msg: '', data: { messageArr: messages.reverse() } };
  }
}
