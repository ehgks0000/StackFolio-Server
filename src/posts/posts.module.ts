import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from 'src/users/entity/user-favorite.entity';
import { UserFavoriteRepository } from 'src/users/repository/user-favorite.repository';
import { UserProfileRepository } from 'src/users/repository/user-profile.repository';
import { UserRepository } from 'src/users/repository/user.repository';
import { PostInformation } from './entity/post-information.entity';
import { PostMetadata } from './entity/post-metadata.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostLikeRepository } from './repository/post-like.repository';
import { PostRepository } from './repository/post.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostRepository,
      PostLikeRepository,
      PostInformation,
      PostMetadata,
      Favorite,
      UserRepository,
      UserProfileRepository,
      UserFavoriteRepository,
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService, TypeOrmModule],
})
export class PostsModule {}
