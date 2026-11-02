/**
 * Form contatti — invio AJAX
 *
 * @package Arkimedia
 */

document.addEventListener( 'DOMContentLoaded', () => {

    document.querySelectorAll( '.ark-contact__form' ).forEach( ( form ) => {

        const feedback = form.querySelector( '.ark-contact__feedback' )
        const submit   = form.querySelector( '.ark-contact__submit' )

        const fetchToken = async () => {
            const res = await fetch( `${ Arkimedia.ajaxUrl }?action=ark_contact_nonce`, { cache: 'no-store' } )
            return ( await res.json() ).data
        }

        // Controllo del tempo: il conteggio parte quando si entra nel form
        let start = null
        form.addEventListener( 'focusin', () => { start = start || fetchToken() } )

        form.addEventListener( 'submit', async ( e ) => {
            e.preventDefault()
            if ( submit.disabled ) return

            // Stato loading
            submit.disabled = true
            submit.classList.add( 'is-loading' )
            feedback.className = 'ark-contact__feedback'
            feedback.textContent = ''

            try {
                // Nonce richiesto al momento: quello in pagina può essere scaduto in cache
                start = start || fetchToken()
                const { time, sign } = await start
                const { nonce }      = await fetchToken()

                const data = new FormData()
                data.append( 'action',  'ark_contact_form' )
                data.append( 'nonce',   nonce )
                data.append( 'start',   time )
                data.append( 'sign',    sign )
                data.append( 'name',    form.querySelector( '[name="ark_name"]' )?.value || '' )
                data.append( 'email',   form.querySelector( '[name="ark_email"]' )?.value || '' )
                data.append( 'phone',   form.querySelector( '[name="ark_phone"]' )?.value || '' )
                data.append( 'subject', form.querySelector( '[name="ark_subject"]' )?.value || '' )
                data.append( 'message', form.querySelector( '[name="ark_message"]' )?.value || '' )
                data.append( 'website', form.querySelector( '[name="ark_website"]' )?.value || '' )
                if ( form.querySelector( '[name="ark_privacy"]' )?.checked ) data.append( 'privacy', '1' )

                const res  = await fetch( Arkimedia.ajaxUrl, { method: 'POST', body: data } )
                const json = await res.json()

                if ( json.success ) {
                    feedback.classList.add( 'is-success' )
                    feedback.textContent = form.dataset.success
                    form.reset()

                    // Animazione GSAP
                    if ( typeof gsap !== 'undefined' ) {
                        gsap.from( feedback, { opacity: 0, y: 10, duration: 0.4 })
                    }
                } else {
                    start = null
                    feedback.classList.add( 'is-error' )
                    feedback.textContent = form.dataset.error
                }
            } catch {
                start = null
                feedback.classList.add( 'is-error' )
                feedback.textContent = form.dataset.error
            } finally {
                submit.disabled = false
                submit.classList.remove( 'is-loading' )
            }
        })
    })
})
