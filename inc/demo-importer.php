<?php
/**
 * Demo Importer — Pannello installazione contenuto demo.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

// ── Registra la pagina admin ──────────────────────────────────────────────────
function ark_demo_importer_menu(): void {
    add_theme_page(
        __( 'Installa Demo', 'arkimedia' ),
        __( 'Installa Demo', 'arkimedia' ),
        'manage_options',
        'ark-demo-importer',
        'ark_demo_importer_page'
    );
}
add_action( 'admin_menu', 'ark_demo_importer_menu' );

// ── Enqueue stili per la pagina ───────────────────────────────────────────────
function ark_demo_importer_assets( string $hook ): void {
    if ( 'appearance_page_ark-demo-importer' !== $hook ) return;

    wp_enqueue_style(
        'ark-demo-importer',
        get_template_directory_uri() . '/assets/css/admin-demo-importer.css',
        [],
        ARK_VERSION
    );
}
add_action( 'admin_enqueue_scripts', 'ark_demo_importer_assets' );

// ── Render pagina ─────────────────────────────────────────────────────────────
function ark_demo_importer_page(): void {
    if ( ! current_user_can( 'manage_options' ) ) return;

    $imported = get_option( 'ark_demo_imported', false );
    $nonce    = wp_create_nonce( 'ark_demo_import' );
    ?>
    <div class="wrap ark-demo-wrap">

        <div class="ark-demo-header">
            <h1><?php esc_html_e( 'Arkimedia — Installa Demo', 'arkimedia' ); ?></h1>
            <p><?php esc_html_e( 'Importa il contenuto demo per iniziare subito con pagine, menu e impostazioni preconfigurate.', 'arkimedia' ); ?></p>
        </div>

        <?php if ( $imported ) : ?>
        <div class="ark-demo-notice ark-demo-notice--success">
            <span>✅</span>
            <p><?php esc_html_e( 'Contenuto demo già installato. Puoi reimportarlo ma perderai le modifiche esistenti.', 'arkimedia' ); ?></p>
        </div>
        <?php endif; ?>

        <div class="ark-demo-grid">

            <!-- Preview -->
            <div class="ark-demo-preview">
                <div class="ark-demo-preview__img">
                    <div style="background:linear-gradient(135deg,#1a1a2e,#e94560);width:100%;height:200px;border-radius:8px;display:flex;align-items:center;justify-content:center;">
                        <span style="font-size:3rem;">🎨</span>
                    </div>
                </div>
                <h3><?php esc_html_e( 'Tema Arkimedia', 'arkimedia' ); ?></h3>
                <ul class="ark-demo-list">
                    <li>✓ <?php esc_html_e( 'Homepage con Hero, Services, Gallery', 'arkimedia' ); ?></li>
                    <li>✓ <?php esc_html_e( 'Pagine OOH, About, Gallery, Contatti', 'arkimedia' ); ?></li>
                    <li>✓ <?php esc_html_e( 'Menu di navigazione configurato', 'arkimedia' ); ?></li>
                    <li>✓ <?php esc_html_e( 'Impostazioni Customizer', 'arkimedia' ); ?></li>
                    <li>✓ <?php esc_html_e( 'Privacy Policy e Cookie Policy', 'arkimedia' ); ?></li>
                </ul>
            </div>

            <!-- Form importazione -->
            <div class="ark-demo-actions">
                <div class="ark-demo-requirements">
                    <h3><?php esc_html_e( 'Requisiti', 'arkimedia' ); ?></h3>
                    <ul>
                        <?php
                        $wordpress_importer = is_plugin_active( 'wordpress-importer/wordpress-importer.php' );
                        ?>
                        <li class="<?php echo $wordpress_importer ? 'ok' : 'missing'; ?>">
                            <?php echo $wordpress_importer ? '✅' : '⚠️'; ?>
                            WordPress Importer
                            <?php if ( ! $wordpress_importer ) : ?>
                                — <a href="<?php echo esc_url( admin_url( 'plugin-install.php?s=wordpress+importer&tab=search' ) ); ?>" target="_blank">
                                    <?php esc_html_e( 'Installa', 'arkimedia' ); ?>
                                </a>
                            <?php endif; ?>
                        </li>
                        <li class="ok">✅ <?php echo esc_html( ARK_DIR . '/demo/content.xml' ); ?> — <?php echo file_exists( ARK_DIR . '/demo/content.xml' ) ? '✅ trovato' : '❌ mancante'; ?></li>
                        <li class="ok">✅ customizer.dat — <?php echo file_exists( ARK_DIR . '/demo/customizer.dat' ) ? '✅ trovato' : '❌ mancante'; ?></li>
                    </ul>
                </div>

                <div id="ark-demo-log" class="ark-demo-log" style="display:none;"></div>

                <form method="post" action="" id="ark-demo-form">
                    <?php wp_nonce_field( 'ark_demo_import', 'ark_demo_nonce' ); ?>
                    <input type="hidden" name="ark_demo_action" value="import">

                    <div class="ark-demo-options">
                        <label>
                            <input type="checkbox" name="import_content" value="1" checked>
                            <?php esc_html_e( 'Importa pagine e contenuto', 'arkimedia' ); ?>
                        </label>
                        <label>
                            <input type="checkbox" name="import_customizer" value="1" checked>
                            <?php esc_html_e( 'Importa impostazioni Customizer', 'arkimedia' ); ?>
                        </label>
                        <label>
                            <input type="checkbox" name="setup_menus" value="1" checked>
                            <?php esc_html_e( 'Configura menu di navigazione', 'arkimedia' ); ?>
                        </label>
                        <label>
                            <input type="checkbox" name="setup_homepage" value="1" checked>
                            <?php esc_html_e( 'Imposta homepage e pagina blog', 'arkimedia' ); ?>
                        </label>
                    </div>

                    <button type="submit" class="ark-demo-btn" <?php echo ! $wordpress_importer ? 'disabled' : ''; ?>>
                        <?php echo $imported
                            ? esc_html__( 'Reimporta contenuto demo', 'arkimedia' )
                            : esc_html__( 'Installa contenuto demo', 'arkimedia' ); ?>
                    </button>

                    <?php if ( ! $wordpress_importer ) : ?>
                        <p class="ark-demo-warning"><?php esc_html_e( 'Installa prima il plugin WordPress Importer per procedere.', 'arkimedia' ); ?></p>
                    <?php endif; ?>
                </form>
            </div>

        </div>
    </div>
    <?php
}

// ── Gestione importazione ─────────────────────────────────────────────────────
function ark_demo_handle_import(): void {
    if ( ! isset( $_POST['ark_demo_action'] ) || $_POST['ark_demo_action'] !== 'import' ) return;
    if ( ! current_user_can( 'manage_options' ) ) return;
    if ( ! isset( $_POST['ark_demo_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['ark_demo_nonce'] ) ), 'ark_demo_import' ) ) return;

    $import_content    = ! empty( $_POST['import_content'] );
    $import_customizer = ! empty( $_POST['import_customizer'] );
    $setup_menus       = ! empty( $_POST['setup_menus'] );
    $setup_homepage    = ! empty( $_POST['setup_homepage'] );

    $messages = [];

    // 1. Importa contenuto XML
    if ( $import_content ) {
        $xml_file = ARK_DIR . '/demo/content.xml';
        if ( file_exists( $xml_file ) && is_plugin_active( 'wordpress-importer/wordpress-importer.php' ) ) {
            require_once ABSPATH . 'wp-admin/includes/import.php';

            $plugin_file = WP_PLUGIN_DIR . '/wordpress-importer/wordpress-importer.php';
            if ( file_exists( $plugin_file ) ) {
                require_once $plugin_file;
            }

            // Compatibilità con versioni diverse del plugin
            if ( class_exists( 'WP_Import' ) ) {
                $importer = new WP_Import();
                $importer->fetch_attachments = true;
                ob_start();
                $importer->import( $xml_file );
                ob_end_clean();
                $messages[] = '✅ ' . __( 'Contenuto importato correttamente.', 'arkimedia' );
            } elseif ( class_exists( 'WordPressImporter' ) ) {
                $importer = new WordPressImporter();
                $importer->fetch_attachments = true;
                ob_start();
                $importer->import( $xml_file );
                ob_end_clean();
                $messages[] = '✅ ' . __( 'Contenuto importato correttamente.', 'arkimedia' );
            } else {
                // Fallback: usa wp_import_handle_upload via WP CLI style
                $messages[] = '⚠️ ' . __( 'Classe importer non trovata. Importa manualmente da Strumenti → Importa.', 'arkimedia' );
            }
        } else {
            $messages[] = '❌ ' . __( 'File content.xml non trovato o WordPress Importer non attivo.', 'arkimedia' );
        }
    }

    // 2. Importa Customizer
    if ( $import_customizer ) {
        $dat_file = ARK_DIR . '/demo/customizer.dat';
        if ( file_exists( $dat_file ) ) {
            $data = unserialize( base64_decode( file_get_contents( $dat_file ) ) );
            if ( is_array( $data ) ) {
                foreach ( $data as $option_name => $option_value ) {
                    if ( strpos( $option_name, 'widget_' ) === 0 ) continue;
                    set_theme_mod( $option_name, $option_value );
                }
                $messages[] = '✅ ' . __( 'Impostazioni Customizer importate.', 'arkimedia' );
            }
        } else {
            $messages[] = '❌ ' . __( 'File customizer.dat non trovato.', 'arkimedia' );
        }
    }

    // 3. Configura menu
    if ( $setup_menus ) {
        $menu_name = 'Menu Principale';
        $menu      = wp_get_nav_menu_object( $menu_name );
        if ( $menu ) {
            $locations = get_theme_mod( 'nav_menu_locations', [] );
            $locations['primary'] = $menu->term_id;
            set_theme_mod( 'nav_menu_locations', $locations );
            $messages[] = '✅ ' . __( 'Menu configurato.', 'arkimedia' );
        } else {
            $messages[] = '⚠️ ' . __( 'Menu "Menu Principale" non trovato — configuralo manualmente.', 'arkimedia' );
        }
    }

    // 4. Imposta homepage
    if ( $setup_homepage ) {
        $homepage = get_page_by_path( 'home' );
        if ( $homepage ) {
            update_option( 'show_on_front', 'page' );
            update_option( 'page_on_front', $homepage->ID );
            $messages[] = '✅ ' . __( 'Homepage impostata.', 'arkimedia' );
        } else {
            $messages[] = '⚠️ ' . __( 'Pagina "home" non trovata — imposta la homepage manualmente.', 'arkimedia' );
        }
    }

    // Flush rewrite rules
    flush_rewrite_rules();

    // Segna come importato
    update_option( 'ark_demo_imported', true );

    // Salva messaggi in transient per mostrarli dopo redirect
    set_transient( 'ark_demo_messages', $messages, 60 );

    wp_safe_redirect( add_query_arg( [
        'page'   => 'ark-demo-importer',
        'status' => 'success',
    ], admin_url( 'themes.php' ) ) );
    exit;
}
add_action( 'admin_init', 'ark_demo_handle_import' );
