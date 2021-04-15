import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as _Post } from './entity/post.entity';
import { PostsService } from './posts.service';
import docs from './posts.docs';
import { Tag } from 'src/tags/entity/tag.entity';
import { TagsService } from 'src/tags/tags.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { CreateTagDto } from 'src/tags/dto/create-tag.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly tagsService: TagsService,
  ) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(docs.post['posts'].operation)
  @ApiOkResponse(docs.post['posts'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  createPost(@Req() req, @Body() data: CreatePostDto): Promise<_Post> {
    return this.postsService.createPost(req.user.id, data);
  }
  // jwt req.user가 있고 없고로 endpoint 구분 가능한가?
  @Get('')
  @ApiOperation(docs.get['posts'].operation)
  @ApiOkResponse(docs.get['posts'].response[200])
  getPostsAll(): Promise<_Post[]> {
    return this.postsService.getPostsAll();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiOperation(docs.get['posts'].operation)
  @ApiOkResponse(docs.get['posts'].response[200])
  getMyPosts(@Req() req): Promise<_Post[]> {
    return this.postsService.getPosts(req.user.id, true);
  }

  @Get('user/:user_id')
  @ApiOperation(docs.get['user/:user_id'].operation)
  @ApiOkResponse(docs.get['user/:user_id'].response[200])
  getPosts(@Param('user_id') userId: string): Promise<_Post[]> {
    return this.postsService.getPosts(userId);
  }

  @Get(':post_id')
  @ApiOperation(docs.get[':post_id'].operation)
  @ApiOkResponse(docs.get[':post_id'].response[200])
  getPost(@Param('post_id') postId: string): Promise<_Post[]> {
    return this.postsService.getPost(postId);
  }

  @Patch('')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(docs.patch[':post_id'].operation)
  @ApiOkResponse(docs.patch[':post_id'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  updatePost(
    @Req() req,
    @Query('post_id') postId: string,
    @Body() data: UpdatePostDto,
  ): Promise<_Post> {
    return this.postsService.updatePost(req.user.id, postId, data);
  }

  //   @Get('like')
  //   @UseGuards(JwtAuthGuard)
  //   getLikePosts(@Req() req) {
  //     return this.postsService.getLikePosts(req.user.id);
  //   }

  @Post('like/:post_id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation(docs.post['like/:post_id'].operation)
  @ApiOkResponse(docs.post['like/:post_id'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  likePost(@Req() req, @Param('post_id') postId: string): Promise<void> {
    return this.postsService.likePost(req.user, postId);
  }

  @Post('unlike/:post_id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation(docs.post['unlike/:post_id'].operation)
  @ApiOkResponse(docs.post['unlike/:post_id'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  unlikePost(@Req() req, @Param('post_id') postId: string): Promise<void> {
    return this.postsService.unlikePost(req.user.id, postId);
  }

  @Delete(':post_id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(docs.delete[':post_id'].operation)
  @ApiOkResponse(docs.delete[':post_id'].response[200])
  @ApiUnauthorizedResponse(docs.unauthorized)
  deletePost(@Req() req, @Param('post_id') postId: string): Promise<_Post> {
    return this.postsService.deletePost(req.user.id, postId);
  }

  @Post('upload/thumbnail')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('thumbnail'))
  async uploadThumbnail(
    @Req() req,
    @Query('post_id') postId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return await this.postsService.uploadThumbnail(
      req.user.id,
      postId,
      file.buffer,
      file.originalname,
    );
  }

  @Post('upload/contentImages')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('contentImages'))
  async uploadContentImages(
    @Req() req,
    @Query('post_id') postId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return await this.postsService.uploadContentImages(
      req.user.id,
      postId,
      file.buffer,
      file.originalname,
    );
  }

  @Delete('thumbnail/test')
  @UseGuards(JwtAuthGuard)
  deleteThumbnail(@Req() req, @Query('post_id') postId: string): Promise<void> {
    return this.postsService.deleteThumbnail(req.user.id, postId);
  }

  //   @Post('tag')
  //   @UseGuards(JwtAuthGuard)
  //   createTag(
  //     @Req() req,
  //     @Query('postId') postId: string,
  //     @Body() data: CreateTagDto,
  //   ) {
  //     return this.postsService.createTag(req.user.id, postId, data);
  //   }
}
