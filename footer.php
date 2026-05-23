<?php
/**
 * Footer del tema.
 *
 * @package Arkimedia
 */

$footer_bg = get_theme_mod( 'ark_color_footer_bg', '#0a0a0a' );
?>
    </div><!-- #content -->

    <footer id="colophon" class="site-footer" style="background:<?php echo esc_attr( $footer_bg ); ?>;">
        <div class="container site-footer__inner">

            <p class="site-footer__copy">
                &copy; <?php echo esc_html( gmdate( 'Y' ) ); ?>
                <?php bloginfo( 'name' ); ?>
                <?php
                $piva = get_theme_mod( 'ark_footer_piva', '' );
                if ( $piva ) :
                ?>
                    &nbsp;&mdash;&nbsp;<?php echo esc_html( $piva ); ?>
                <?php endif; ?>
            </p>

            <?php
            wp_nav_menu( [
                'theme_location' => 'footer',
                'menu_class'     => 'site-footer__nav',
                'container'      => false,
                'depth'          => 1,
                'fallback_cb'    => false,
            ] );
            ?>

        </div>
    </footer>

</div><!-- #page -->

<?php wp_footer(); ?>
</body>
</html>
