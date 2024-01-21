import { z } from "zod";

import type { Word } from "@prisma/client";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const wordRouter = createTRPCRouter({
  getRandomWord: publicProcedure
    .query(async ({ ctx }) => {
      const dictionary = ctx.dictionary;
      const keys = Object.keys(dictionary);

      let findRandomWord = true;
      let word = '';

      while (findRandomWord) {
        word = keys[Math.floor(Math.random() * keys.length)]!

        if (ctx.session?.user.email) {
          const existingUserWord = await ctx.db.word.findFirst({
            where: { name: word, user: { id: ctx.session.user.id } },
          });
          findRandomWord = !!existingUserWord;
        } else {
          findRandomWord = false;
        }
      }

      return { name: word, definition: dictionary[word]! };
    }),

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

  update: protectedProcedure
    .input(z.object({
      id: z.number().min(1),
      notes: z.string().optional(),
      definition: z.string().min(1)
    }))
    .mutation(async ({ ctx, input }): Promise<Word> => {
      return await ctx.db.word.update({
        where: { id: input.id },
        data: {
          definition: input.definition,
          notes: input.notes
        }
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number().min(1) }))
    .mutation(async ({ ctx, input }): Promise<Word> => {
      return await ctx.db.word.delete({ where: { id: input.id } });
    }),

  getUserWords: protectedProcedure
    .query(({ ctx }) => {
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
