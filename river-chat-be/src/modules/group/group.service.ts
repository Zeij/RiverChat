import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RCode } from 'src/common/constant/rcode';
import { Like, Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { Group, GroupMap } from './entity/group.entity';
import { GroupMessage } from './entity/groupMessage.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupMap)
    private readonly groupUserRepository: Repository<GroupMap>,
    @InjectRepository(GroupMessage)
    private readonly groupMessageRepository: Repository<GroupMessage>,
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
  ) {}
  async postGroups(groupIds: string) {
    try {
      if (groupIds) {
        const groupIdArr = groupIds.split(',');
        const groupArr = [];
        for (const groupId of groupIdArr) {
          const data = await this.groupRepository.findOne({
            where: { groupId: groupId },
          });
          groupArr.push(data);
        }
        return { msg: '获取群信息成功', data: groupArr };
      }
      return { code: RCode.FAIL, msg: '获取群信息失败', data: null };
    } catch (e) {
      return { code: RCode.ERROR, msg: '获取群失败', data: e };
    }
  }
  async getUserGroups(userId: string) {
    try {
      let data;
      if (userId) {
        data = await this.groupUserRepository.find({
          where: { userId: userId },
        });
        return { msg: '获取用户所有群成功', data };
      }
      data = await this.groupUserRepository.find();
      return { msg: '获取系统所有群成功', data };
    } catch (e) {
      return { code: RCode.ERROR, msg: '获取用户的群失败', data: e };
    }
  }
  async getGroupUsers(groupId: string) {
    try {
      let data;
      if (groupId) {
        data = await this.groupUserRepository.find({
          where: { groupId: groupId },
        });
        return { msg: '获取群的所有用户成功', data };
      }
    } catch (e) {
      return { code: RCode.ERROR, msg: '获取群的用户失败', data: e };
    }
  }
  async getGroupMessages(groupId: string, current: number, pageSize: number) {
    let groupMessage = await this.groupMessageRepository
      .createQueryBuilder('groupMessage')
      .orderBy('groupMessage.time', 'DESC')
      .where('groupMessage.groupId = :id', { id: groupId })
      .skip(current)
      .take(pageSize)
      .getMany();
    groupMessage = groupMessage.reverse();

    const userGather: { [key: string]: User } = {};
    let userArr: FriendDto[] = [];
    for (const message of groupMessage) {
      if (!userGather[message.userId]) {
        userGather[message.userId] =
          await this.UserRepository.createQueryBuilder('user')
            .where('user.userId = :id', { id: message.userId })
            .getOne();
      }
    }
    userArr = Object.values(userGather);
    return { msg: '', data: { messageArr: groupMessage, userArr: userArr } };
  }
  async getGroupsByName(groupName: string) {
    try {
      if (groupName) {
        const groups = await this.groupRepository.find({
          where: { groupName: Like(`%${groupName}%`) },
        });
        console.log(groups);
        return { data: groups };
      }
      return { code: RCode.FAIL, msg: '请输入群昵称', data: null };
    } catch (e) {
      return { code: RCode.ERROR, msg: '查找群错误', data: null };
    }
  }
}
