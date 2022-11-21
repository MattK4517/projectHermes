import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const exampleRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    }),
  godList: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.conquest_Casual_910.findMany({
      where: {
        player: {contains: "LordKarnox"}
      },
      select: {
        god: true,
      },
    })
  }),
});
