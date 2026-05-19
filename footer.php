<?php
/**
 * Footer del tema.
 *
 * @package Arkimedia
 */
?>
    </div><!-- #content -->

    <footer id="colophon" class="site-footer">
        <div class="container">

            <?php if ( is_active_sidebar( 'footer-1' ) ) : ?>
                <div class="footer__widgets">
                    <?php dynamic_sidebar( 'footer-1' ); ?>
                </div>
            <?php endif; ?>

            <div class="footer__bottom">
                <p class="footer__credits">
                    &copy; <?php echo esc_html( gmdate( 'Y' ) ); ?>
                    <a href="<?php echo esc_url( home_url( '/' ) ); ?>">
                        <?php bloginfo( 'name' ); ?>
                    </a>
                </p>
                <?php
                wp_nav_menu( [
                    'theme_location' => 'footer',
                    'menu_class'     => 'footer__nav',
                    'container'      => false,
                    'depth'          => 1,
                    'fallback_cb'    => false,
                ] );
                ?>
            </div>

        </div>
    </footer>

</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
