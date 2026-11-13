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

.PHONY: all ej1 ej2 ej3 ej4 ej5 test reglas ansi verify clean help nb1 nb2 nb3 ni1 ni2 ni3 na1 na2 na3 na4 anidados test_anidados web

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
	for entrada in pruebas/ej*.in; do \
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
	@sh herramientas/verificar_reglas.sh $(addprefix $(SRC_DIR)/,$(addsuffix .c,$(EJERCICIOS))) $(wildcard $(SRC_DIR)/anidados/basico/*.c) $(wildcard $(SRC_DIR)/anidados/intermedio/*.c) $(wildcard $(SRC_DIR)/anidados/avanzado/*.c)

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
B4 = b4

I1 = i1_collatz_y_catalanes
I2 = i2_intervalos_y_rectas
I3 = i3_lab_2025_1_sucesionB

A1 = a1_numeros_felices_primos
A2 = a2_validar_password_6_cifras
A3 = a3_zuckerman_y_casa_lucas
A4 = a4_centro_masa_y_sumatorias

EJERCICIOS_NIVELES = $(B1) $(B2) $(B3) $(B4) $(I1) $(I2) $(I3) $(A1) $(A2) $(A3) $(A4)
BINARIOS_NIVELES   = $(addprefix $(BIN_DIR)/,$(EJERCICIOS_NIVELES))

# Se agregan las rutas con subcarpeta a EJERCICIOS para que 'make reglas' y
# 'make ansi' verifiquen automáticamente los 15 programas del proyecto.
EJERCICIOS += basico/$(B1) basico/$(B2) basico/$(B3) basico/$(B4) \
              intermedio/$(I1) intermedio/$(I2) intermedio/$(I3) \
              avanzado/$(A1) avanzado/$(A2) avanzado/$(A3) avanzado/$(A4)

.PHONY: b1 b2 b3 b4 i1 i2 i3 a1 a2 a3 a4 list

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
b4: $(BIN_DIR)/$(B4)
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

# Guías 8-9: Ciclos iterativos anidados.
ANIDADOS = nb1_triangulo_pascal_for nb2_tablas_digitos_y_pitagorica nb3_primos_gemelos_subrangos_mersenne \
           ni1_goldbach_euclides_fracciones ni2_juego_capicuas_y_multibase ni3_poderosos_intocables_sociables \
           na1_cambio_base_especial_nk na2_primos_buenos_debiles_honaker na3_lynch_bell_y_ormiston na4_odontologicos_2025_2_y_triangulos

$(BIN_DIR)/nb%: $(SRC_DIR)/anidados/basico/nb%.c | $(BIN_DIR)
	$(CC) $(CFLAGS) $< -o $@ $(LDLIBS)
$(BIN_DIR)/ni%: $(SRC_DIR)/anidados/intermedio/ni%.c | $(BIN_DIR)
	$(CC) $(CFLAGS) $< -o $@ $(LDLIBS)
$(BIN_DIR)/na%: $(SRC_DIR)/anidados/avanzado/na%.c | $(BIN_DIR)
	$(CC) $(CFLAGS) $< -o $@ $(LDLIBS)

nb1: $(BIN_DIR)/nb1_triangulo_pascal_for
	@./$<
nb2: $(BIN_DIR)/nb2_tablas_digitos_y_pitagorica
	@./$<
nb3: $(BIN_DIR)/nb3_primos_gemelos_subrangos_mersenne
	@./$<
ni1: $(BIN_DIR)/ni1_goldbach_euclides_fracciones
	@./$<
ni2: $(BIN_DIR)/ni2_juego_capicuas_y_multibase
	@./$<
ni3: $(BIN_DIR)/ni3_poderosos_intocables_sociables
	@./$<
na1: $(BIN_DIR)/na1_cambio_base_especial_nk
	@./$<
na2: $(BIN_DIR)/na2_primos_buenos_debiles_honaker
	@./$<
na3: $(BIN_DIR)/na3_lynch_bell_y_ormiston
	@./$<
na4: $(BIN_DIR)/na4_odontologicos_2025_2_y_triangulos
	@./$<

anidados: $(addprefix $(BIN_DIR)/,$(ANIDADOS))

test_anidados: anidados
	@fallas=0; for entrada in pruebas/anidados_*.in; do [ -f "$$entrada" ] || continue; caso=$$(basename "$$entrada" .in); clave=$${caso#anidados_}; bin=""; for nombre in $(ANIDADOS); do case "$$clave" in "$$nombre"*) bin="$(BIN_DIR)/$$nombre"; break;; esac; done; if [ -n "$$bin" ] && $$bin < "$$entrada" | diff -q - "pruebas/$$caso.out" >/dev/null; then echo "  OK    $$caso"; else echo "  FALLA $$caso"; [ -n "$$bin" ] && $$bin < "$$entrada" | diff - "pruebas/$$caso.out"; fallas=$$((fallas+1)); fi; done; test $$fallas -eq 0 && echo "Todos los casos anidados pasan."

list:
	@echo "======================================================================"
	@echo "  COMANDOS DISPONIBLES - 1INF01 FUNDAMENTOS DE PROGRAMACION (PUCP)"
	@echo "  [Ejercicios existentes] make ej1..ej5, b1..b4, i1..i3, a1..a4"
	@echo "  [Guías 8-9 Básico] make nb1, nb2, nb3"
	@echo "  [Guías 8-9 Intermedio] make ni1, ni2, ni3"
	@echo "  [Guías 8-9 Avanzado] make na1, na2, na3, na4"
	@echo "  [Utilidades] make all, anidados, test, test_anidados, reglas, ansi, verify, web, clean"
	@echo "======================================================================"

web:
	@echo "Plataforma de estudio: http://localhost:8080"
	@python3 herramientas/servidor_web.py --port 8080
