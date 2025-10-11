import prisma from '../../core/prisma';
import { ApiError } from '../../core/errors';
import { beneficioSchema, programaSchema, testimonioSchema } from './tourism.schemas';

export async function listProgramas(visible?: boolean) {
  return prisma.programaTuristico.findMany({
    where: visible === undefined ? {} : { visible },
    orderBy: [{ visible: 'desc' }, { id: 'asc' }]
  });
}

export async function createPrograma(data: unknown) {
  const parsed = programaSchema.parse(data);
  return prisma.programaTuristico.create({ data: parsed });
}

export async function updatePrograma(id: number, data: unknown) {
  const parsed = programaSchema.partial().parse(data);
  try {
    return await prisma.programaTuristico.update({ where: { id }, data: parsed });
  } catch (error) {
    throw new ApiError(404, 'Programa no encontrado');
  }
}

export async function deletePrograma(id: number) {
  try {
    await prisma.programaTuristico.delete({ where: { id } });
  } catch (error) {
    throw new ApiError(404, 'Programa no encontrado');
  }
}

export async function listBeneficios() {
  return prisma.beneficio.findMany({ orderBy: { id: 'asc' } });
}

export async function createBeneficio(data: unknown) {
  const parsed = beneficioSchema.parse(data);
  return prisma.beneficio.create({ data: parsed });
}

export async function updateBeneficio(id: number, data: unknown) {
  const parsed = beneficioSchema.partial().parse(data);
  try {
    return await prisma.beneficio.update({ where: { id }, data: parsed });
  } catch (error) {
    throw new ApiError(404, 'Beneficio no encontrado');
  }
}

export async function deleteBeneficio(id: number) {
  try {
    await prisma.beneficio.delete({ where: { id } });
  } catch (error) {
    throw new ApiError(404, 'Beneficio no encontrado');
  }
}

export async function listTestimonios(visible?: boolean) {
  return prisma.testimonio.findMany({
    where: visible === undefined ? {} : { visible },
    orderBy: [{ visible: 'desc' }, { id: 'asc' }]
  });
}

export async function createTestimonio(data: unknown) {
  const parsed = testimonioSchema.parse(data);
  return prisma.testimonio.create({ data: parsed });
}

export async function updateTestimonio(id: number, data: unknown) {
  const parsed = testimonioSchema.partial().parse(data);
  try {
    return await prisma.testimonio.update({ where: { id }, data: parsed });
  } catch (error) {
    throw new ApiError(404, 'Testimonio no encontrado');
  }
}

export async function deleteTestimonio(id: number) {
  try {
    await prisma.testimonio.delete({ where: { id } });
  } catch (error) {
    throw new ApiError(404, 'Testimonio no encontrado');
  }
}

export function parseVisibleQuery(value: unknown) {
  if (value === undefined) return undefined;
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new ApiError(400, 'Parámetro visible inválido');
}
