import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const exampleRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    }),
  godList: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.conquest_Casual_910.f({
      where: {
        player: { contains: "LordKarnox" },
      },
      select: {
        god: true,
      },
    });
  }),
});
