import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PostRepository } from './posts.repository';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';

describe('PostsService', () => {
  let service: PostsService;

  const mockPostsRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PostRepository,
          useValue: mockPostsRepository,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPost', () => {
    it('should create a post', async () => {
      const dto: CreatePostDto = { title: 'Test Post', content: 'Test Content' };
      const createdPost = { id: '1', ...dto };

      mockPostsRepository.create.mockResolvedValue(createdPost);

      const result = await service.create(dto);

      expect(result).toEqual(createdPost);
      expect(mockPostsRepository.create).toHaveBeenCalledWith(dto);
    });

    it('should throw an error if creation fails', async () => {
      const dto: CreatePostDto = { title: 'Test Post', content: 'Test Content' };
      const errorMessage = 'Error creating post';

      mockPostsRepository.create.mockRejectedValue(new Error(errorMessage));

      await expect(service.create(dto)).rejects.toThrow(errorMessage);
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const posts = [
        { id: '1', author: 'mock-author-id', title: 'Test Post 1', content: 'Test Content 1' },
        { id: '2', author: 'mock-author-id', title: 'Test Post 2', content: 'Test Content 2' },
      ];

      mockPostsRepository.findAll.mockResolvedValue(posts);

      const result = await service.findAll();

      expect(result).toEqual(posts);
      expect(mockPostsRepository.findAll).toHaveBeenCalled();
    });

    it('should throw an error if finding posts fails', async () => {
      const errorMessage = 'Error finding posts';

      mockPostsRepository.findAll.mockRejectedValue(new Error(errorMessage));

      await expect(service.findAll()).rejects.toThrow(errorMessage);
    });
  });

  describe('findById', () => {
    it('should return a post by id', async () => {
      const post = { id: '1', author: 'mock-author-id', title: 'Test Post', content: 'Test Content' };

      mockPostsRepository.findById.mockResolvedValue(post);

      const result = await service.findOne('1');

      expect(result).toEqual(post);
      expect(mockPostsRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw an error if post not found', async () => {
      const errorMessage = 'Post not found';

      mockPostsRepository.findById.mockRejectedValue(new Error(errorMessage));

      await expect(service.findOne('1')).rejects.toThrow(errorMessage);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const dto: UpdatePostDto = { title: 'Updated Title', content: 'Updated Content' };
      const updatedPost = { id: '1', ...dto };

      mockPostsRepository.update.mockResolvedValue(updatedPost);

      const result = await service.update('1', dto);

      expect(result).toEqual(updatedPost);
      expect(mockPostsRepository.update).toHaveBeenCalledWith('1', dto);
    });

    it('should throw an error if update fails', async () => {
      const dto: UpdatePostDto = { title: 'Updated Title', content: 'Updated Content' };
      const errorMessage = 'Error updating post';

      mockPostsRepository.update.mockRejectedValue(new Error(errorMessage));

      await expect(service.update('1', dto)).rejects.toThrow(errorMessage);
    });
  });

  describe('delete', () => {
    it('should delete a post', async () => {
      mockPostsRepository.delete.mockResolvedValue(true);

      const result = await service.remove('1');

      expect(result).toBe(true);
      expect(mockPostsRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw an error if delete fails', async () => {
      const errorMessage = 'Error deleting post';

      mockPostsRepository.delete.mockRejectedValue(new Error(errorMessage));

      await expect(service.remove('1')).rejects.toThrow(errorMessage);
    });
  });

  describe('remove', () => {
    it('should remove a post', async () => {
      mockPostsRepository.delete.mockResolvedValue(true);

      const result = await service.remove('1');

      expect(result).toBe(true);
      expect(mockPostsRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw an error if remove fails', async () => {
      const errorMessage = 'Error removing post';

      mockPostsRepository.delete.mockRejectedValue(new Error(errorMessage));

      await expect(service.remove('1')).rejects.toThrow(errorMessage);
    });
  });
});
