import { z } from "zod";

// Enum schemas
 const TeamColorSchema = z.enum(["red", "blue"]);
 const CardColorSchema = z.enum(["red", "blue", "bystander", "assassin"]);
 const RoleSchema = z.enum(["spymaster", "operative"]);

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

// Game state schema
 const GameStatePayloadSchema = z.object({
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