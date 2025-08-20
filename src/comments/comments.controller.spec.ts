import { Test, TestingModule } from "@nestjs/testing";
import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";
import { AuthGuard } from "src/guards/auth.guard";
import { RolesGuard } from "src/guards/roles.guard";
import { Types } from "mongoose";

describe('CommentsController', () => {
    let controller: CommentsController;

    const mockCommentsService = {
        create: jest.fn(),
        findOne: jest.fn(),
        findByPostIdWithAuthorsAggregated: jest.fn(),
        findAll: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CommentsController],
            providers: [
                {
                    provide: CommentsService,
                    useValue: mockCommentsService,
                },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .overrideGuard(RolesGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        controller = module.get<CommentsController>(CommentsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should inject comments service', () => {
        expect(mockCommentsService).toBeDefined();
    });

    it('should create a comment and return the result', () => {
        const userId = 'userId';
        const postId = 'postId';
        const commentDto = { content: 'Nice post!' };
        mockCommentsService.create.mockReturnValue(commentDto);
        const result = controller.createComment(userId, postId, commentDto);
        expect(mockCommentsService.create).toHaveBeenCalledWith(userId, postId, commentDto);
        expect(result).toEqual(commentDto);
    });

    it('should call findByPostIdWithAuthorsAggregated when only postId is present', async () => {
        const userId = new Types.ObjectId().toHexString();
        const postId = new Types.ObjectId().toHexString();
        const result = [{ comment: 'test' }];

        mockCommentsService.findByPostIdWithAuthorsAggregated.mockResolvedValue(result);

        const response = await controller.getComments(userId, { postId });
        expect(mockCommentsService.findByPostIdWithAuthorsAggregated).toHaveBeenCalledWith(
            new Types.ObjectId(userId),
            new Types.ObjectId(postId),
        );
        expect(response).toBe(result);
    });

    it('should call findOne when only commentId is present', async () => {
        const userId = 'user-id';
        const commentId = 'comment-id';
        const result = { comment: 'test' };

        mockCommentsService.findOne.mockResolvedValue(result);

        const response = await controller.getComments(userId, { commentId });
        expect(mockCommentsService.findOne).toHaveBeenCalledWith(userId, commentId);
        expect(response).toBe(result);
    });

    it('should call findAll when neither postId nor commentId is present', async () => {
        const userId = 'user-id';
        const result = [{ comment: 'test' }];

        mockCommentsService.findAll.mockResolvedValue(result);

        const response = await controller.getComments(userId, {});
        expect(mockCommentsService.findAll).toHaveBeenCalledWith(userId);
        expect(response).toBe(result);
    });

    it('should call findAll when both postId and commentId are present', async () => {
        const userId = 'user-id';
        const postId = 'post-id';
        const commentId = 'comment-id';
        const result = [{ comment: 'test' }];

        mockCommentsService.findAll.mockResolvedValue(result);

        const response = await controller.getComments(userId, { postId, commentId });
        expect(mockCommentsService.findAll).toHaveBeenCalledWith(userId);
        expect(response).toBe(result);
    });

    it('should update a comment and return the result', async () => {
        const userId = new Types.ObjectId();
        const commentId = new Types.ObjectId();
        const commentDto = { content: 'Updated comment' };
        mockCommentsService.update.mockResolvedValue(commentDto);
        const result = await controller.updateComment(String(userId), String(commentId), commentDto);
        expect(mockCommentsService.update).toHaveBeenCalledWith(userId, commentId, commentDto);
        expect(result).toEqual(commentDto);
    });

    it('should remove a comment and return the result', async () => {
        const userId = new Types.ObjectId();
        const commentId = new Types.ObjectId();
        mockCommentsService.remove.mockResolvedValue(true);
        const result = await controller.deleteComment(String(userId), String(commentId));
        expect(mockCommentsService.remove).toHaveBeenCalledWith(userId, commentId);
        expect(result).toEqual(true);
    });
});
