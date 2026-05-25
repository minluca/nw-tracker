Devo progettare lo schema ER completo per una webapp di personal finance tracking (porting da Excel). Ti fornisco l'analisi dei requisiti completa e dettagliata.

CONTESTO
Applicazione single-user con autenticazione (email+password). L'utente traccia il proprio patrimonio netto (Net Worth) attraverso tre macro-aree: gestione cash flow (entrate/uscite categorizzate), portafoglio investimenti (stocks/ETF/bonds), e storico mensile del NW. La valuta base è EUR.

ENTITÀ E TABELLE
users
Autenticazione single-user. Campi standard: id (UUID, PK), email, password_hash, created_at.

accounts
Conti finanziari dell'utente. Un conto ha un saldo iniziale da cui si parte; il saldo corrente è sempre calcolato dinamicamente (opening_balance + somma entrate - somma uscite).
Campi: id (UUID, PK), name (TEXT), type (ENUM: cash / bank / investment / other), opening_balance (DECIMAL), opening_date (DATE), currency (TEXT, default EUR), is_active (BOOLEAN), linked_for_investments (BOOLEAN — indica se questo conto viene scalato automaticamente quando si acquista un asset).

categories
Completamente personalizzabili dall'utente. Sia per income che expense.
Campi: id (UUID, PK), name (TEXT), type (ENUM: income / expense), icon (TEXT — emoji o nome icona), color (TEXT — hex), is_active (BOOLEAN), sort_order (INT).

transactions
Ogni movimento di denaro. I transfer tra conti generano due record collegati da transfer_links.
Campi: id (UUID, PK), account_id (FK → accounts), date (DATE), type (ENUM: income / expense / transfer), payee (TEXT), memo (TEXT, nullable), category_id (FK → categories, nullable per i transfer), amount (DECIMAL, sempre positivo), currency (TEXT, default EUR), exchange_rate (DECIMAL, nullable — solo se currency ≠ EUR), created_at (TIMESTAMP).

transfer_links
Collega i due lati di un movimento interno tra conti (es. da Cash a Conto Corrente). Entrambi i record in transactions hanno type = transfer.
Campi: id (UUID, PK), from_transaction_id (FK → transactions), to_transaction_id (FK → transactions).

autofill_rules
Regole di suggerimento automatico e coppie preferite payee → categoria. Usate nella UI per suggerire la categoria durante l'inserimento di una transazione.
Campi: id (UUID, PK), payee_keyword (TEXT — match parziale sul campo payee della transazione), category_id (FK → categories), is_favorite (BOOLEAN — true = coppia preferita con accesso rapido, false = solo suggerimento), use_count (INT — incrementato ogni volta che la regola viene applicata, usato per ordinare i suggerimenti), last_used (DATE).

recurring_templates
Template per transazioni ricorrenti (abbonamenti, stipendio, bollette, ecc.). Il sistema genera automaticamente una transazione (o bozza) in base alla frequenza configurata.
Campi: id (UUID, PK), type (ENUM: income / expense), payee (TEXT), category_id (FK → categories), account_id (FK → accounts), amount (DECIMAL, nullable se importo variabile), is_fixed_amount (BOOLEAN), frequency (ENUM: monthly / weekly / yearly), day_of_month (INT — giorno previsto nel mese), is_structural (BOOLEAN — true = spesa fissa "per vivere", es. affitto/bollette; distingue spese strutturali da discrezionali), draft_mode (BOOLEAN — true = inserisce la transazione come bozza da confermare; false = inserisce direttamente), reminder_days_before (INT — quanti giorni prima l'utente vuole essere avvisato), is_active (BOOLEAN).

transaction_drafts
Bozze di transazioni generate da recurring_templates con draft_mode = true, in attesa di conferma da parte dell'utente. Una volta confermata, la bozza viene promossa a record in transactions.
Campi: id (UUID, PK), recurring_template_id (FK → recurring_templates), suggested_date (DATE), suggested_amount (DECIMAL, nullable), status (ENUM: pending / confirmed / skipped), created_at (TIMESTAMP), resolved_at (TIMESTAMP, nullable).

assets
Strumenti finanziari nel portafoglio (ETF, azioni, obbligazioni).
Campi: id (UUID, PK), ticker (TEXT), name (TEXT), asset_type (ENUM: stock / etf / bond / crypto), currency (TEXT), is_fixed_income (BOOLEAN — per bond con rendimento fisso), is_active (BOOLEAN).

asset_orders
Storico acquisti e vendite di asset. Ogni ordine genera automaticamente una transazione speculare sul conto cash collegato (linked_for_investments = true). Le commissioni vengono registrate come spesa in categoria Commissioni.
Campi: id (UUID, PK), asset_id (FK → assets), account_id (FK → accounts — il conto da cui/verso cui fluisce il denaro), order_date (DATE), delta_units (DECIMAL — positivo = acquisto, negativo = vendita), order_price (DECIMAL — prezzo per unità in valuta dell'asset), fees (DECIMAL, nullable), linked_transaction_id (FK → transactions — la transazione cash generata automaticamente).

asset_prices
Storico prezzi degli asset, fetchati automaticamente via API (es. Yahoo Finance) o inseriti manualmente.
Campi: id (UUID, PK), asset_id (FK → assets), price (DECIMAL), fetched_at (TIMESTAMP), source (TEXT — es. "yahoo_finance" / "manual").

asset_allocations
Target di allocazione per asset class, configurabile dall'utente. Il sistema confronta target vs allocazione attuale in tempo reale.
Campi: id (UUID, PK), name (TEXT — es. "Cash", "Stocks", "Bonds"), asset_class (ENUM: cash / stocks / bonds / other), target_pct (DECIMAL — es. 0.20 per 20%).

budgets
Tetti di spesa mensili per categoria, configurabili dall'utente. Se null month/year = ricorrente ogni mese.
Campi: id (UUID, PK), category_id (FK → categories), amount (DECIMAL), month (INT, nullable), year (INT, nullable).

goals
Obiettivi di risparmio con deadline opzionale e conto opzionalmente collegato.
Campi: id (UUID, PK), name (TEXT — es. "Fondo emergenza"), target_amount (DECIMAL), current_amount (DECIMAL), deadline (DATE, nullable), linked_account_id (FK → accounts, nullable), is_completed (BOOLEAN).

monthly_snapshots
Snapshot fisso del patrimonio generato alla chiusura del mese. Il flusso è: dal 28 del mese l'utente dà il "via" consapevole (can_close = true); il job notturno dell'ultimo secondo del mese esegue lo snapshot se can_close = true, altrimenti lo esegue il primo del mese successivo come fallback automatico. Lo snapshot è modificabile a posteriori con log della modifica.
Campi: id (UUID, PK), year (INT), month (INT), cash_value (DECIMAL), stocks_value (DECIMAL), bonds_value (DECIMAL), total_nw (DECIMAL), income (DECIMAL — totale entrate del mese), expenses (DECIMAL — totale uscite del mese), is_auto (BOOLEAN — true = generato dal fallback senza consenso esplicito), can_close (BOOLEAN — consenso utente dato), closed_at (TIMESTAMP), modified_at (TIMESTAMP, nullable), modification_note (TEXT, nullable).

events
Raggruppamenti trasversali alle categorie che aggregano transazioni accomunate da un contesto (es. viaggio, concerto, periodo particolare). Una transazione può appartenere a più eventi.
Campi: id (UUID, PK), name (TEXT — es. "Viaggio Londra Gen 2026"), type (ENUM: viaggio / evento / periodo / altro), start_date (DATE), end_date (DATE, nullable), notes (TEXT, nullable).

transaction_events
Join many-to-many tra transactions ed events.
Campi: transaction_id (FK → transactions), event_id (FK → events). PK composta.

notification_settings
Preferenze dell'utente per ogni tipo di notifica/reminder. Permette di attivare/disattivare ogni categoria di avviso e configurarne i parametri.
Campi: id (UUID, PK), notification_type (ENUM: budget_warning / income_expected / draft_pending / month_close_reminder / goal_progress / recurring_reminder), is_enabled (BOOLEAN), threshold_pct (DECIMAL, nullable — es. 0.80 per avvisare all'80% del budget), recurring_template_id (FK → recurring_templates, nullable — per reminder specifici di un template).

RELAZIONI CHIAVE DA RISPETTARE

transactions.account_id → accounts.id
transactions.category_id → categories.id (nullable per transfer)
transfer_links collega sempre due transactions con type = transfer
asset_orders.linked_transaction_id → transactions.id (generata automaticamente all'acquisto/vendita)
asset_orders.account_id → accounts.id (il conto con linked_for_investments = true)
transaction_drafts.recurring_template_id → recurring_templates.id
transaction_events è many-to-many puro
budgets.category_id → categories.id
goals.linked_account_id → accounts.id (nullable)
notification_settings.recurring_template_id → recurring_templates.id (nullable)

VINCOLI E NOTE IMPLEMENTATIVE

Il saldo di ogni account non è mai salvato direttamente ma sempre calcolato: opening_balance + SUM(amount WHERE type=income) - SUM(amount WHERE type=expense) - SUM(amount WHERE type=transfer AND from) + SUM(amount WHERE type=transfer AND to)
Il capital gain di un asset è calcolato dinamicamente: (live_price - avg_order_price) \* total_units
L'allocazione attuale è calcolata: cash = somma saldi conti non-investment / total_nw; stocks = valore portfolio stocks / total_nw; ecc.
exchange_rate in transactions serve per transazioni in valuta estera: l'importo salvato è sempre in EUR, exchange_rate è conservato per riferimento storico
Un recurring_template con draft_mode = false e is_fixed_amount = true non richiede mai intervento utente; uno con draft_mode = true o is_fixed_amount = false genera sempre una bozza in transaction_drafts

Chiedo di produrre: il diagramma ER completo con tutte le entità, attributi, relazioni (cardinalità), e chiavi. Se rilevi inconsistenze o proponi ottimizzazioni allo schema, segnalale esplicitamente prima di procedere col disegno.
