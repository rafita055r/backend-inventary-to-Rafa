const supabase = require("../supabaseClient");

async function getMainStorage() {
  const ID_mainStorage = process.env.MAIN_STORAGE_ID;

  try {
    const { data: mainStorage, err } = await supabase
      .from("obras")
      .select(
        `
                    *,
                    herramientas_en_obras!herramientas_en_obras_obra_actual_id_fkey (
                    id,
                    cantidad,
                    herramientas (
                        id,
                        nombre,
                        marca,
                        estado,
                        cantidad_total,
                        medidas,
                        observacion
                    ) 
                    )
                `
      )

      .eq("id", ID_mainStorage)
      .single();

    if (err) throw err;
    return { data: mainStorage };
  } catch (error) {
    return { error };
  }
}

async function getWorkByID(work_id) {
  try {
    const { data: work, error } = await supabase
      .from("obras")
      .select(
        `
                    *,
                    herramientas_en_obras!herramientas_en_obras_obra_actual_id_fkey (
                    id,
                    cantidad,
                    herramientas (
                        id,
                        nombre,
                        marca,
                        estado,
                        cantidad_total,
                        medidas,
                        observacion
                    ) 
                    )
                `
      )
      .eq("id", work_id)
      .single();

    if (error) throw error;
    return work;
  } catch (error) {
    return error;
  }
}

async function getWorks() {
  try {
    const { data, error } = await supabase.from("obras").select(`
    *,
    herramientas_en_obras!herramientas_en_obras_obra_actual_id_fkey (
      id,
      cantidad,
      herramienta_id,
      herramientas (
        id,
        nombre,
        marca,
        estado,
        cantidad_total,
        medidas,
        observacion
      )
    )
  `);

    if (error) throw error;

    // Ordenamos las props con sus respectivos nombres
    // para las herramientas dentro de cada obra
    const works = data.map((work) => {
      const toolsInWork = work.herramientas_en_obras.map((tool) => {
        return {
          cantidad: tool.cantidad,
          herramienta_id: tool.herramientas.id,
          nombre: tool.herramientas.nombre,
        };
      });

      return {
        id: work.id,
        nombre: work.nombre,
        direccion: work.direccion,
        herramientas_enObra: toolsInWork,
      };
    });

    return works;
  } catch (error) {
    console.log(error);
    return { error };
  }
}

module.exports = {
  getMainStorage,
  getWorkByID,
  getWorks,
};
