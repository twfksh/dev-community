import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
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
    const userDto: CreateUserDto = { name: 'Test User', email: 'test@example.com', password: 'password', type: 'user' };
    const createdUser = { ...userDto, id: '12345' };
    mockUserRepository.create.mockResolvedValue(createdUser);
    const result = await service.create(userDto);
    expect(result).toEqual(createdUser);
    expect(mockUserRepository.create).toHaveBeenCalledWith(expect.objectContaining(userDto));
    expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should find all users', async () => {
    const users = [
      { id: '1', name: 'User One', email: 'user1@example.com', password: 'password', type: 'user' },
      { id: '2', name: 'User Two', email: 'user2@example.com', password: 'password', type: 'user' },
    ];
    mockUserRepository.findAll.mockResolvedValue(users);
    const result = await service.findAll();
    expect(result).toEqual(users);
    expect(mockUserRepository.findAll).toHaveBeenCalledWith();
    expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should find a user by id', async () => {
    const user = { id: '1', name: 'User One', email: 'user1@example.com', password: 'password', type: 'user' };
    mockUserRepository.findById.mockResolvedValue(user);
    const result = await service.findOne('1');
    expect(result).toEqual(user);
    expect(mockUserRepository.findById).toHaveBeenCalledWith('1');
    expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('should update a user', async () => {
    const userDto: UpdateUserDto = { name: 'Updated User', email: 'updated@example.com', password: 'password', type: 'user' };
    const updatedUser = { ...userDto, id: '1' };
    mockUserRepository.update.mockResolvedValue(updatedUser);
    const result = await service.update('1', userDto);
    expect(result).toEqual(updatedUser);
    expect(mockUserRepository.update).toHaveBeenCalledWith('1', expect.objectContaining(userDto));
    expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
  });

  it('should delete a user', async () => {
    mockUserRepository.delete.mockResolvedValue(true);
    const result = await service.remove('1');
    expect(result).toEqual(true);
    expect(mockUserRepository.delete).toHaveBeenCalledWith('1');
    expect(mockUserRepository.delete).toHaveBeenCalledTimes(1);
  });
});