import { Test, TestingModule } from "@nestjs/testing";
import { ReactionsController } from "./reactions.controller";
import { ReactionsService } from "./reactions.service";
import { AuthGuard } from "src/guards/auth.guard";
import { RolesGuard } from "src/guards/roles.guard";
import { CreateReactionDto } from "./dtos/create-reaction.dto";
import { Reactions } from "./enums/reaction.enum";

describe('ReactionsController', () => {
    let controller: ReactionsController;

    const mockReactionsService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findByEntityId: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ReactionsController],
            providers: [
                {
                    provide: ReactionsService,
                    useValue: mockReactionsService,
                },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .overrideGuard(RolesGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        controller = module.get<ReactionsController>(ReactionsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should inject ReactionsService', () => {
        expect(mockReactionsService).toBeDefined();
    });

    it('should create a reaction and return the result', () => {
        const userId = 'userId';
        const reactionDto: CreateReactionDto = { entityId: 'entityId', entityType: 'Post', type: Reactions.LIKE };

        controller.createReaction(userId, reactionDto);

        expect(mockReactionsService.create).toHaveBeenCalledWith(userId, reactionDto);
        expect(mockReactionsService.create).toHaveBeenCalledTimes(1);
    });

    it('should return all reactions', () => {
        const reactions = [{}, {}];
        mockReactionsService.findAll.mockReturnValue(reactions);
        const result = controller.getReactions();
        expect(mockReactionsService.findAll).toHaveBeenCalledTimes(1);
        expect(result).toEqual(reactions);
    });

    it('should return reactions for a specific entity', () => {
        const entityId = 'entityId';
        const reactions = [{}];
        mockReactionsService.findByEntityId.mockReturnValue(reactions);
        const result = controller.getReactions(entityId);
        expect(mockReactionsService.findByEntityId).toHaveBeenCalledWith(entityId);
        expect(result).toEqual(reactions);
    });

    it('should update a reaction and return the result', () => {
        const userId = 'userId';
        const entityId = 'entityId';
        const reactionDto: CreateReactionDto = { entityId: 'entityId', entityType: 'Post', type: Reactions.LIKE };
        mockReactionsService.update.mockReturnValue(reactionDto);
        const result = controller.updateReaction(userId, entityId, reactionDto);
        expect(mockReactionsService.update).toHaveBeenCalledWith(userId, entityId, reactionDto);
        expect(result).toEqual(reactionDto);
    });

    it('should remove a reaction and return the result', () => {
        const userId = 'userId';
        const entityId = 'entityId';
        mockReactionsService.remove.mockReturnValue(undefined);
        const result = controller.removeReaction(userId, entityId);
        expect(mockReactionsService.remove).toHaveBeenCalledWith(userId, entityId);
        expect(result).toBeUndefined();
    });
});
