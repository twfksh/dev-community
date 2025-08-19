import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/users.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';

jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('UsersService', () => {
  let service: UsersService;

  const mockUser: User = {
    _id: new Types.ObjectId(),
    name: 'Test User',
    email: 'test_user@example.com',
    password: 'hashedPassword',
    role: 'user',
  };

  const mockUsersModel = {
    create: jest.fn().mockResolvedValue(mockUser),
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockUser]),
    }),
    findOne: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUser),
    }),
    findByIdAndUpdate: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUser),
    }),
    findByIdAndDelete: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUser),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUsersModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      name: 'Test User',
      email: 'test_user@example.com',
      password: 'plainPassword',
      role: 'user',
    };

    mockedBcrypt.genSalt.mockResolvedValue('salt' as never);
    mockedBcrypt.hash.mockResolvedValue('hashedPassword' as never);

    const result = await service.create(createUserDto);

    // Verify bcrypt functions were called
    expect(mockedBcrypt.genSalt).toHaveBeenCalled();
    expect(mockedBcrypt.hash).toHaveBeenCalledWith('plainPassword', 'salt');

    // The service mutates the original object, so expect the modified version
    expect(mockUsersModel.create).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test_user@example.com',
      password: 'hashedPassword', // This is the hashed password
      role: 'user',
    });

    expect(result).toEqual(mockUser);
  });

  it('should find all users', async () => {
    const result = await service.findAll();

    expect(mockUsersModel.find).toHaveBeenCalled();
    expect(result).toEqual([mockUser]);
  });

  it('should find one user', async () => {
    const email = 'test_user@example.com';

    const result = await service.findOne(email);

    expect(mockUsersModel.findOne).toHaveBeenCalledWith({
      $or: [{ id: email }, { email: email }],
    });
    expect(result).toEqual(mockUser);
  });

  it('should update a user', async () => {
    const userId = mockUser._id.toString();
    const updateData = { name: 'Updated Name' };

    const result = await service.update(userId, updateData);

    expect(mockUsersModel.findByIdAndUpdate).toHaveBeenCalledWith(
      userId,
      updateData,
      { new: true },
    );
    expect(result).toEqual(mockUser);
  });

  it('should remove a user', async () => {
    const userId = mockUser._id.toString();

    const result = await service.remove(userId);

    expect(mockUsersModel.findByIdAndDelete).toHaveBeenCalledWith(userId);
    expect(result).toEqual(mockUser);
  });
});
