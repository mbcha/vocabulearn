import { z } from "zod";

import type { Word } from "@prisma/client";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const wordRouter = createTRPCRouter({
  getRandomWord: publicProcedure.query(({ ctx }) => {
    const dictionary = ctx.dictionary;
    const keys = Object.keys(dictionary);
    const word = keys[Math.floor(Math.random() * keys.length)]
    const definition = dictionary[word!];
    return { word, definition };
  }),

  // hello: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input.text}`,
  //     };
  //   }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1), definition: z.string().min(1) }))
    .mutation(async ({ ctx, input }): Promise<Word> => {
      return await ctx.db.word.create({
        data: {
          name: input.name,
          definition: input.definition,
          user: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getUserWords: protectedProcedure.query(({ ctx }) => {
    return ctx.db.word.findMany({
      orderBy: { createdAt: "desc" },
      where: { user: { id: ctx.session.user.id } },
    });
  }),

  findDefinition: protectedProcedure
    .input(z.object({ word: z.string().min(1) }))
    .query(({ ctx, input }) => {
      const word = input.word;
      const definition = ctx.dictionary[word];
      return { word, definition };
  })
});
