import z from "zod";

export const addDocumentSchema = z.object({
  type: z.enum(["ordinance", "resolution", "memorandum"]),
  status: z.enum([
    "draft",
    "for_review",
    "in_session",
    "approved",
    "rejected",
    "archived",
    "vetoed",
  ]),
  title: z.string().min(1, "Title is required"),
  author_name: z.string().min(1, "Author name is required"),
  series: z.string().min(1, "Series (Year) is required"),
  description: z.string().optional(),
  file: z
    .instanceof(File, { message: "File is required" })
    .nullable()
    .refine((file) => file !== null, { message: "File is required" }),
  approved_by: z.string().optional(),
  approved_at: z.string().optional(),
});

export type AddDocumentForm = z.infer<typeof addDocumentSchema>;

export const editDocumentSchema = z.object({
  type: z.enum(["ordinance", "resolution", "memorandum"]),
  status: z.enum([
    "draft",
    "for_review",
    "in_session",
    "approved",
    "rejected",
    "archived",
    "vetoed",
  ]),
  title: z.string().min(1, "Title is required"),
  author_name: z.string().min(1, "Author name is required"),
  series: z.string().min(1, "Series (Year) is required"),
  description: z.string().nullable().optional(),
  file: z.instanceof(File).nullable().optional(),
  approved_by: z.string().optional(),
  approved_at: z.string().optional(),
});

export type EditDocumentForm = z.infer<typeof editDocumentSchema>;
