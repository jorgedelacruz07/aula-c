# =============================================================================
#  Makefile - 1INF01 Fundamentos de Programación (PUCP)
#  Cada ejercicio de ejercicios/ es un programa autónomo con su propio main:
#  se compila por separado, así nunca hay "duplicate symbol '_main'".
#
#  make ej1 .. make ej5   compila (si cambió) y EJECUTA el ejercicio
#  make all               compila los 5 en build/
#  make test              corre los casos de pruebas/ y compara la salida
#  make reglas            verifica las reglas del curso (sin for, break, [], ...)
#  make ansi              compila además en modo ANSI C89 estricto
#  make clean             borra build/
# =============================================================================

CC      = clang
CFLAGS  = -Wall -Wextra
LDLIBS  = -lm
SRC_DIR = ejercicios
BIN_DIR = build

EJ1 = ej1_secuencia_digitos
EJ2 = ej2_sucesiones_y_sumatorias
EJ3 = ej3_lotes_y_contadores_ref
EJ4 = ej4_rotacion_y_bases
EJ5 = ej5_riemann_y_limites
EJERCICIOS = $(EJ1) $(EJ2) $(EJ3) $(EJ4) $(EJ5)
BINARIOS   = $(addprefix $(BIN_DIR)/,$(EJERCICIOS))

.PHONY: all ej1 ej2 ej3 ej4 ej5 test reglas ansi verify clean help

all: $(BINARIOS)

$(BIN_DIR)/%: $(SRC_DIR)/%.c | $(BIN_DIR)
	$(CC) $(CFLAGS) $< -o $@ $(LDLIBS)

$(BIN_DIR):
	mkdir -p $@

ej1: $(BIN_DIR)/$(EJ1)
	@./$<
ej2: $(BIN_DIR)/$(EJ2)
	@./$<
ej3: $(BIN_DIR)/$(EJ3)
	@./$<
ej4: $(BIN_DIR)/$(EJ4)
	@./$<
ej5: $(BIN_DIR)/$(EJ5)
	@./$<

# Cada pruebas/ejN_*.in se envía por stdin al ejercicio N y la salida se
# compara contra el .out del mismo nombre.
test: all
	@fallas=0; \
	for entrada in pruebas/*.in; do \
		caso=$$(basename $$entrada .in); \
		num=$$(echo $$caso | sed -E 's/^ej([0-9]+)_.*/\1/'); \
		bin=$$(ls $(BIN_DIR)/ej$${num}_* | head -1); \
		if $$bin < $$entrada | diff -q - pruebas/$$caso.out > /dev/null; then \
			echo "  OK    $$caso"; \
		else \
			echo "  FALLA $$caso"; $$bin < $$entrada | diff - pruebas/$$caso.out; \
			fallas=$$((fallas + 1)); \
		fi; \
	done; \
	test $$fallas -eq 0 && echo "Todos los casos pasan."

reglas:
	@sh herramientas/verificar_reglas.sh $(addprefix $(SRC_DIR)/,$(addsuffix .c,$(EJERCICIOS)))

ansi:
	@fallas=0; \
	for f in $(addprefix $(SRC_DIR)/,$(addsuffix .c,$(EJERCICIOS))); do \
		if $(CC) -std=c89 -pedantic $(CFLAGS) -Wno-strict-prototypes -fsyntax-only $$f; then \
			echo "  OK  $$f (C89)"; \
		else \
			echo "  FALLA $$f (C89)"; fallas=$$((fallas + 1)); \
		fi; \
	done; \
	test $$fallas -eq 0

verify: all test reglas ansi

clean:
	rm -rf $(BIN_DIR)

help:
	@sed -n '2,12p' Makefile

# =============================================================================
#  EXTENSION POR NIVELES: BASICO (b1..b3), INTERMEDIO (i1..i3), AVANZADO (a1..a4)
# =============================================================================

B1 = b1_polinomio_completo
B2 = b2_mcm_y_pi_wallis
B3 = b3_tres_consecutivos

I1 = i1_collatz_y_catalanes
I2 = i2_intervalos_y_rectas
I3 = i3_lab_2025_1_sucesionB

A1 = a1_numeros_felices_primos
A2 = a2_validar_password_6_cifras
A3 = a3_zuckerman_y_casa_lucas
A4 = a4_centro_masa_y_sumatorias

EJERCICIOS_NIVELES = $(B1) $(B2) $(B3) $(I1) $(I2) $(I3) $(A1) $(A2) $(A3) $(A4)
BINARIOS_NIVELES   = $(addprefix $(BIN_DIR)/,$(EJERCICIOS_NIVELES))

# Se agregan las rutas con subcarpeta a EJERCICIOS para que 'make reglas' y
# 'make ansi' verifiquen automáticamente los 15 programas del proyecto.
EJERCICIOS += basico/$(B1) basico/$(B2) basico/$(B3) \
              intermedio/$(I1) intermedio/$(I2) intermedio/$(I3) \
              avanzado/$(A1) avanzado/$(A2) avanzado/$(A3) avanzado/$(A4)

.PHONY: b1 b2 b3 i1 i2 i3 a1 a2 a3 a4 list

all: $(BINARIOS_NIVELES)

$(BIN_DIR)/%: $(SRC_DIR)/basico/%.c | $(BIN_DIR)
	$(CC) $(CFLAGS) $< -o $@ $(LDLIBS)

$(BIN_DIR)/%: $(SRC_DIR)/intermedio/%.c | $(BIN_DIR)
	$(CC) $(CFLAGS) $< -o $@ $(LDLIBS)

$(BIN_DIR)/%: $(SRC_DIR)/avanzado/%.c | $(BIN_DIR)
	$(CC) $(CFLAGS) $< -o $@ $(LDLIBS)

b1: $(BIN_DIR)/$(B1)
	@./$<
b2: $(BIN_DIR)/$(B2)
	@./$<
b3: $(BIN_DIR)/$(B3)
	@./$<

i1: $(BIN_DIR)/$(I1)
	@./$<
i2: $(BIN_DIR)/$(I2)
	@./$<
i3: $(BIN_DIR)/$(I3)
	@./$<

a1: $(BIN_DIR)/$(A1)
	@./$<
a2: $(BIN_DIR)/$(A2)
	@./$<
a3: $(BIN_DIR)/$(A3)
	@./$<
a4: $(BIN_DIR)/$(A4)
	@./$<

list:
	@echo "======================================================================"
	@echo "  COMANDOS DISPONIBLES - 1INF01 FUNDAMENTOS DE PROGRAMACION (PUCP)"
	@echo "======================================================================"
	@echo "  [Bloque Original]"
	@echo "    make ej1   -> Secuencia entre digitos contiguos"
	@echo "    make ej2   -> Sucesion Z(n) y sumatoria con factorial"
	@echo "    make ej3   -> Lote de iluminancias y contadores por referencia"
	@echo "    make ej4   -> Rotacion de digitos y suma en base b"
	@echo "    make ej5   -> Suma de Riemann e integral exacta"
	@echo ""
	@echo "  [Nivel Basico - ejercicios/basico/]"
	@echo "    make b1    -> Polinomio completo (Guia 2.1.1)"
	@echo "    make b2    -> MCM (100 primeros multiplos) y Pi de Wallis (Guia 2.1.3 y 2.1.9)"
	@echo "    make b3    -> Tres numeros consecutivos sin arreglos (Guia 2.1.7)"
	@echo ""
	@echo "  [Nivel Intermedio - ejercicios/intermedio/]"
	@echo "    make i1    -> Conjetura de Collatz y Numeros Catalanes (Guia 2.2.1 y 2.2.3)"
	@echo "    make i2    -> Interseccion de intervalos y Rectas PQ/RS (Guia 2.1.5 y 2.2.2)"
	@echo "    make i3    -> Lab 5 (2025-1): Sucesion B(n), Densidad y Presion (Guia 2.2.9)"
	@echo ""
	@echo "  [Nivel Avanzado - ejercicios/avanzado/]"
	@echo "    make a1    -> Numeros felices e infelices primos (Guia 2.3.1)"
	@echo "    make a2    -> Validacion de password bancario de 6 cifras (Guia 2.3.4)"
	@echo "    make a3    -> Lab 5 (2023-2): Zuckerman, T(n), Casa y Lucas (Guia 2.3.9 y 2.3.10)"
	@echo "    make a4    -> Centro de masa 2D y Sumatoria Lab 2021-2 (Guia 2.3.7 y 2.3.8)"
	@echo ""
	@echo "  [Verificacion y Utilidades]"
	@echo "    make all    -> Compila los 15 programas en build/"
	@echo "    make reglas -> Verifica las reglas estrictas PUCP en los 15 archivos"
	@echo "    make ansi   -> Verifica compatibilidad ANSI C89 en los 15 archivos"
	@echo "    make test   -> Ejecuta la bateria de pruebas automaticas"
	@echo "    make verify -> Compila, prueba y valida reglas del curso + C89"
	@echo "    make clean  -> Elimina la carpeta build/"
	@echo "======================================================================"
