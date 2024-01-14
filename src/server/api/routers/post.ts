import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.post.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  getRandomWord: protectedProcedure.query(({ ctx }) => {
    const dictionary = ctx.dictionary;
    const keys = Object.keys(dictionary);
    const word = keys[Math.floor(Math.random() * keys.length)]
    const definition = dictionary[word!];
    return { word, definition };
  }),

  findDefinition: protectedProcedure
    .input(z.object({ word: z.string().min(1) }))
    .query(({ ctx, input }) => {
      const word = input.word;
      const definition = ctx.dictionary[word];
      return { word, definition };
  })
});
