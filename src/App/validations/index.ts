import { z } from "zod";
import { ECardColor, ERole, ETeamColor, IGameState } from "../types";

// Enum schemas
const TeamColorSchema = z.enum([ETeamColor.RED, ETeamColor.BLUE]);
const CardColorSchema = z.enum([ECardColor.RED, ECardColor.BLUE, ECardColor.BYSTANDER, ECardColor.ASSASSIN]);
const RoleSchema = z.enum([ERole.SPYMASTER, ERole.OPERATIVE]);

// Card type schema
const CardTypeSchema = z.object({
    word: z.string(),
    color: CardColorSchema.nullable(),
    isRevealed: z.boolean(),
    wasRecentlyRevealed: z.boolean(),
});

// Chat message schema
const ChatMessageSchema = z.object({
    sender: RoleSchema,
    message: z.string(),
    team: TeamColorSchema,
    cards: z.array(CardTypeSchema),
});

// Clue schema
const ClueSchema = z.object({
    clueText: z.string(),
    number: z.number(),
});

const ParticipantSchema = z.object({
    name: z.string(),
    team: TeamColorSchema,
});

// Game state schema
const GameStatePayloadSchema: z.ZodType<IGameState> = z.object({
    roomId: z.string(),
    cards: z.array(CardTypeSchema),
    chatHistory: z.array(ChatMessageSchema),
    currentTeam: TeamColorSchema,
    currentRole: RoleSchema,
    previousTeam: TeamColorSchema.nullable(),
    previousRole: RoleSchema.nullable(),
    remainingRed: z.number(),
    remainingBlue: z.number(),
    currentClue: ClueSchema.nullable(),
    currentGuesses: z.array(z.string()).nullable(),
    gameWinner: TeamColorSchema.nullable(),
    participants: z.array(ParticipantSchema),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const Validations = {
    TeamColorSchema,
    CardColorSchema,
    RoleSchema,
    CardTypeSchema,
    ChatMessageSchema,
    ClueSchema,
    GameStatePayloadSchema
}