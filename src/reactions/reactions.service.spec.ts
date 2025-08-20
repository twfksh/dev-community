import { Test, TestingModule } from "@nestjs/testing";
import { ReactionsService } from "./reactions.service";
import { getModelToken } from "@nestjs/mongoose";
import { Reaction } from "./schemas/reactions.schema";
import { CreateReactionDto } from "./dtos/create-reaction.dto";
import { Reactions } from "./enums/reaction.enum";
import { UpdateReactionDto } from "./dtos/update-reaction.dto";

describe('ReactionsService', () => {
    let service: ReactionsService;

    const mockReactionModel = {
        create: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        findOneAndUpdate: jest.fn(),
        findOneAndDelete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReactionsService,
                {
                    provide: getModelToken(Reaction.name),
                    useValue: mockReactionModel,
                },
            ],
        }).compile();

        service = module.get<ReactionsService>(ReactionsService);
        jest.clearAllMocks();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should create a reaction and return the result', async () => {
        const user = 'mock-user-id';
        const reactionDto: CreateReactionDto = {
            entityId: 'mock-entity-id',
            entityType: 'Post',
            type: Reactions.LIKE,
        };

        mockReactionModel.create.mockResolvedValue({ user, ...reactionDto });

        const result = await service.create(user, reactionDto);
        expect(result).toEqual({ user, ...reactionDto });
        expect(mockReactionModel.create).toHaveBeenCalledWith({ ...reactionDto, user });
        expect(mockReactionModel.create).toHaveBeenCalledTimes(1);
    });

    it('should find all reactions', async () => {
        const reactions = [{ user: 'mock-user-id', entityId: 'mock-entity-id', entityType: 'Post', type: Reactions.LIKE }];

        mockReactionModel.find.mockReturnValue({
            exec: jest.fn().mockResolvedValue(reactions),
        });

        const result = await service.findAll();
        expect(result).toEqual(reactions);
        expect(mockReactionModel.find).toHaveBeenCalled();
        expect(mockReactionModel.find).toHaveBeenCalledTimes(1);
    });

    it('should find reactions for particular post and return the result', async () => {
        const entityId = 'mock-entity-id';
        const reactions = [{ user: 'mock-user-id', entityId: entityId, entityType: 'Post', type: Reactions.LIKE }];

        mockReactionModel.find.mockReturnValue({
            exec: jest.fn().mockResolvedValue(reactions),
        });

        const result = await service.findByEntityId(entityId);
        expect(result).toEqual(reactions);
        expect(mockReactionModel.find).toHaveBeenCalledWith({ entityId: entityId });
        expect(mockReactionModel.find).toHaveBeenCalledTimes(1);
    });

    it('should find reactions by user id', async () => {
        const userId = 'mock-user-id';
        const reactions = [{ user: userId, entityId: 'mock-entity-id', entityType: 'Post', type: Reactions.LIKE }];

        mockReactionModel.find.mockReturnValue({
            exec: jest.fn().mockResolvedValue(reactions),
        });

        const result = await service.findByUserId(userId);
        expect(result).toEqual(reactions);
        expect(mockReactionModel.find).toHaveBeenCalledWith({ user: userId });
        expect(mockReactionModel.find).toHaveBeenCalledTimes(1);
    })

    it('should find reactions by user id and post id', async () => {
        const userId = 'mock-user-id';
        const entityId = 'mock-entity-id';
        const reactions = [{ user: userId, entityId, entityType: 'Post', type: Reactions.LIKE }];

        mockReactionModel.findOne.mockReturnValue({
            exec: jest.fn().mockResolvedValue(reactions),
        });

        const result = await service.findByUserIdAndPostId(userId, entityId);
        expect(result).toEqual(reactions);
        expect(mockReactionModel.findOne).toHaveBeenCalledWith({ user: userId, entityId });
        expect(mockReactionModel.findOne).toHaveBeenCalledTimes(1);
    });

    it('should update a reaction and return the result', async () => {
        const userId = 'mock-user-id';
        const entityId = 'mock-entity-id';
        const updateDto: UpdateReactionDto = {
            type: Reactions.LOVE,
        };

        mockReactionModel.findOneAndUpdate.mockResolvedValue({ user: userId, entityId, ...updateDto });

        const result = await service.update(userId, entityId, updateDto);
        expect(result).toEqual({ user: userId, entityId, ...updateDto });
        expect(mockReactionModel.findOneAndUpdate).toHaveBeenCalledWith({ user: userId, entityId }, updateDto, { new: true });
        expect(mockReactionModel.findOneAndUpdate).toHaveBeenCalledTimes(1);
    });

    it('should delete a reaction and return the result', async () => {
        const userId = 'mock-user-id';
        const entityId = 'mock-entity-id';

        mockReactionModel.findOneAndDelete.mockResolvedValue({ user: userId, entityId });

        const result = await service.remove(userId, entityId);
        expect(result).toEqual({ user: userId, entityId });
        expect(mockReactionModel.findOneAndDelete).toHaveBeenCalledWith({ user: userId, entityId });
        expect(mockReactionModel.findOneAndDelete).toHaveBeenCalledTimes(1);
    });
});