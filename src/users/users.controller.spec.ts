import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthPayload } from '../types/auth-payload';
import { Types } from 'mongoose';
import { User } from './schemas/users.schema';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUser: User = {
    _id: new Types.ObjectId('64a1b2c3d4e5f6789abcdef0'),
    name: 'John Doe',
    email: 'john@example.com',
    password: '$2b$10$hashedPassword',
    role: 'user',
    bio: 'Software Developer',
    skills: ['JavaScript', 'TypeScript'],
    experiances: [],
  };

  const mockAdminUser: User = {
    _id: new Types.ObjectId('64a1b2c3d4e5f6789abcdef1'),
    name: 'Admin User',
    email: 'admin@example.com',
    password: '$2b$10$hashedPassword',
    role: 'admin',
    bio: 'System Administrator',
    skills: ['Management'],
    experiances: [],
  };

  const mockUsers: User[] = [mockUser, mockAdminUser];

  const mockAuthPayload: AuthPayload = {
    sub: '64a1b2c3d4e5f6789abcdef0',
    email: 'john@example.com',
    role: 'user',
    iat: Math.floor(Date.now() / 1000),
  };

  const mockAdminAuthPayload: AuthPayload = {
    sub: '64a1b2c3d4e5f6789abcdef1',
    email: 'admin@example.com',
    role: 'admin',
    iat: Math.floor(Date.now() / 1000),
  };

  const mockCreateUserDto: CreateUserDto = {
    name: 'New User',
    email: 'newuser@example.com',
    password: 'NewPassword123',
    role: 'user',
    bio: 'New developer',
    skills: ['React', 'Node.js'],
  };

  const mockUsersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Controller Initialization', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should have usersService injected', () => {
      expect(mockUsersService).toBeDefined();
    });
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      mockUsersService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.getUsers();

      expect(mockUsersService.findAll).toHaveBeenCalled();
      expect(mockUsersService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUsers);
    });

    it('should return empty array when no users exist', async () => {
      mockUsersService.findAll.mockResolvedValue([]);

      const result = await controller.getUsers();

      expect(mockUsersService.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should handle service errors', async () => {
      const errorMessage = 'Database connection error';
      mockUsersService.findAll.mockRejectedValue(new Error(errorMessage));

      await expect(controller.getUsers()).rejects.toThrow(errorMessage);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  describe('getProfile', () => {
    it('should return user profile for authenticated user', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.getProfile(mockAuthPayload);

      expect(mockUsersService.findOne).toHaveBeenCalledWith(
        mockAuthPayload.email,
      );
      expect(mockUsersService.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUser);
    });

    it('should return null when user profile not found', async () => {
      mockUsersService.findOne.mockResolvedValue(null);

      const result = await controller.getProfile(mockAuthPayload);

      expect(mockUsersService.findOne).toHaveBeenCalledWith(
        mockAuthPayload.email,
      );
      expect(result).toBeNull();
    });

    it('should handle different user types', async () => {
      mockUsersService.findOne.mockResolvedValue(mockAdminUser);

      const result = await controller.getProfile(mockAdminAuthPayload);

      expect(mockUsersService.findOne).toHaveBeenCalledWith(
        mockAdminAuthPayload.email,
      );
      expect(result).toEqual(mockAdminUser);
    });

    it('should handle service errors', async () => {
      const errorMessage = 'User not found';
      mockUsersService.findOne.mockRejectedValue(new Error(errorMessage));

      await expect(controller.getProfile(mockAuthPayload)).rejects.toThrow(
        errorMessage,
      );
    });
  });

  describe('getUserById', () => {
    it('should return user by valid email', async () => {
      const email = 'john@example.com';
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.getUserById(email);

      expect(mockUsersService.findOne).toHaveBeenCalledWith(email);
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      const email = 'notfound@example.com';
      mockUsersService.findOne.mockResolvedValue(null);

      const result = await controller.getUserById(email);

      expect(mockUsersService.findOne).toHaveBeenCalledWith(email);
      expect(result).toBeNull();
    });

    it('should throw error for invalid email format', async () => {
      const invalidEmails = [
        'invalid-email',
        'no-at-symbol',
        'missing-domain@',
        '@missing-local.com',
        'spaces in@email.com',
        'multiple@@symbols.com',
      ];

      for (const invalidEmail of invalidEmails) {
        await expect(controller.getUserById(invalidEmail)).rejects.toThrow(
          'Invalid ID',
        );
      }

      // Verify service was never called for invalid emails
      expect(mockUsersService.findOne).not.toHaveBeenCalled();
    });

    it('should accept various valid email formats', async () => {
      const validEmails = [
        'simple@example.com',
        'user.name@example.com',
        'user+tag@example.com',
        'user123@example123.com',
        'test@sub.domain.com',
      ];

      mockUsersService.findOne.mockResolvedValue(mockUser);

      for (const validEmail of validEmails) {
        await controller.getUserById(validEmail);
      }

      expect(mockUsersService.findOne).toHaveBeenCalledTimes(
        validEmails.length,
      );
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const updatedUser = { ...mockUser, ...mockCreateUserDto };
      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.updateProfile(
        mockAuthPayload,
        mockCreateUserDto,
      );

      expect(mockUsersService.update).toHaveBeenCalledWith(
        mockAuthPayload.sub,
        mockCreateUserDto,
      );
      expect(result).toEqual(updatedUser);
    });

    it('should handle partial updates', async () => {
      const partialUpdate = { name: 'Updated Name', bio: 'Updated bio' };
      const updatedUser = { ...mockUser, ...partialUpdate };
      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.updateProfile(
        mockAuthPayload,
        partialUpdate as CreateUserDto,
      );

      expect(mockUsersService.update).toHaveBeenCalledWith(
        mockAuthPayload.sub,
        partialUpdate,
      );
      expect(result).toEqual(updatedUser);
    });

    it('should return null when user to update not found', async () => {
      mockUsersService.update.mockResolvedValue(null);

      const result = await controller.updateProfile(
        mockAuthPayload,
        mockCreateUserDto,
      );

      expect(mockUsersService.update).toHaveBeenCalledWith(
        mockAuthPayload.sub,
        mockCreateUserDto,
      );
      expect(result).toBeNull();
    });

    it('should handle service errors', async () => {
      const errorMessage = 'Update failed';
      mockUsersService.update.mockRejectedValue(new Error(errorMessage));

      await expect(
        controller.updateProfile(mockAuthPayload, mockCreateUserDto),
      ).rejects.toThrow(errorMessage);
    });
  });

  describe('updateUser (Admin only)', () => {
    it('should update any user when called by admin', async () => {
      const targetUserId = mockUser._id.toString();
      const updatedUser = { ...mockUser, ...mockCreateUserDto };
      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.updateUser(
        targetUserId,
        mockCreateUserDto,
      );

      expect(mockUsersService.update).toHaveBeenCalledWith(
        targetUserId,
        mockCreateUserDto,
      );
      expect(result).toEqual(updatedUser);
    });

    it('should handle updating non-existent user', async () => {
      const nonExistentId = new Types.ObjectId().toString();
      mockUsersService.update.mockResolvedValue(null);

      const result = await controller.updateUser(
        nonExistentId,
        mockCreateUserDto,
      );

      expect(mockUsersService.update).toHaveBeenCalledWith(
        nonExistentId,
        mockCreateUserDto,
      );
      expect(result).toBeNull();
    });

    it('should handle service errors', async () => {
      const targetUserId = mockUser._id.toString();
      const errorMessage = 'Database error';
      mockUsersService.update.mockRejectedValue(new Error(errorMessage));

      await expect(
        controller.updateUser(targetUserId, mockCreateUserDto),
      ).rejects.toThrow(errorMessage);
    });
  });

  describe('deleteUser (Admin only)', () => {
    it('should delete user successfully', async () => {
      const targetUserId = mockUser._id.toString();
      mockUsersService.remove.mockResolvedValue(mockUser);

      const result = await controller.deleteUser(targetUserId);

      expect(mockUsersService.remove).toHaveBeenCalledWith(targetUserId);
      expect(mockUsersService.remove).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUser);
    });

    it('should return null when user to delete not found', async () => {
      const nonExistentId = new Types.ObjectId().toString();
      mockUsersService.remove.mockResolvedValue(null);

      const result = await controller.deleteUser(nonExistentId);

      expect(mockUsersService.remove).toHaveBeenCalledWith(nonExistentId);
      expect(result).toBeNull();
    });

    it('should handle multiple delete operations', async () => {
      const userIds = [
        new Types.ObjectId().toString(),
        new Types.ObjectId().toString(),
      ];

      mockUsersService.remove
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(mockAdminUser);

      const results = await Promise.all(
        userIds.map((id) => controller.deleteUser(id)),
      );

      expect(mockUsersService.remove).toHaveBeenCalledTimes(2);
      expect(results).toEqual([mockUser, mockAdminUser]);
    });

    it('should handle service errors', async () => {
      const targetUserId = mockUser._id.toString();
      const errorMessage = 'Delete operation failed';
      mockUsersService.remove.mockRejectedValue(new Error(errorMessage));

      await expect(controller.deleteUser(targetUserId)).rejects.toThrow(
        errorMessage,
      );
      expect(mockUsersService.remove).toHaveBeenCalledWith(targetUserId);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete user lifecycle', async () => {
      // Get all users
      mockUsersService.findAll.mockResolvedValue(mockUsers);
      const result = await controller.getUsers();
      expect(result).toHaveLength(2);

      // Get specific user
      mockUsersService.findOne.mockResolvedValue(mockUser);
      const userResult = await controller.getUserById(mockUser.email);
      expect(userResult).toEqual(mockUser);

      // Update user
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      mockUsersService.update.mockResolvedValue(updatedUser);
      const updateResult = await controller.updateUser(
        mockUser._id.toString(),
        {
          name: 'Updated Name',
        } as CreateUserDto,
      );
      expect(updateResult?.name).toBe('Updated Name');

      // Delete user
      mockUsersService.remove.mockResolvedValue(mockUser);
      const deleteResult = await controller.deleteUser(mockUser._id.toString());
      expect(deleteResult).toEqual(mockUser);
    });

    it('should maintain proper service call counts', async () => {
      mockUsersService.findAll.mockResolvedValue(mockUsers);
      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockUsersService.update.mockResolvedValue(mockUser);

      await controller.getUsers();
      await controller.getProfile(mockAuthPayload);
      await controller.getUserById(mockUser.email);
      await controller.updateProfile(mockAuthPayload, mockCreateUserDto);

      expect(mockUsersService.findAll).toHaveBeenCalledTimes(1);
      expect(mockUsersService.findOne).toHaveBeenCalledTimes(2); // getProfile + getUserById
      expect(mockUsersService.update).toHaveBeenCalledTimes(1);
    });
  });
});
