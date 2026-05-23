/**
 * Form contatti — invio AJAX
 *
 * @package Arkimedia
 */

document.addEventListener( 'DOMContentLoaded', () => {

    const form = document.querySelector( '.ark-contact__form' )
    if ( ! form ) return

    const feedback = form.querySelector( '.ark-contact__feedback' )
    const submit   = form.querySelector( '.ark-contact__submit' )
    const nonce    = form.querySelector( '[name="ark_contact_nonce"]' )

    form.addEventListener( 'submit', async ( e ) => {
        e.preventDefault()

        // Stato loading
        submit.classList.add( 'is-loading' )
        feedback.className = 'ark-contact__feedback'
        feedback.textContent = ''

        const data = new FormData()
        data.append( 'action', 'ark_contact_form' )
        data.append( 'nonce',   nonce?.value || '' )
        data.append( 'name',    form.querySelector( '[name="ark_name"]' )?.value || '' )
        data.append( 'email',   form.querySelector( '[name="ark_email"]' )?.value || '' )
        data.append( 'phone',   form.querySelector( '[name="ark_phone"]' )?.value || '' )
        data.append( 'subject', form.querySelector( '[name="ark_subject"]' )?.value || '' )
        data.append( 'message', form.querySelector( '[name="ark_message"]' )?.value || '' )

        try {
            const res  = await fetch( Arkimedia.ajaxUrl, { method: 'POST', body: data } )
            const json = await res.json()

            if ( json.success ) {
                feedback.classList.add( 'is-success' )
                feedback.textContent = json.data?.message || form.dataset.success
                form.reset()

                // Animazione GSAP
                if ( typeof gsap !== 'undefined' ) {
                    gsap.from( feedback, { opacity: 0, y: 10, duration: 0.4 })
                }
            } else {
                feedback.classList.add( 'is-error' )
                feedback.textContent = json.data?.message || form.dataset.error
            }
        } catch {
            feedback.classList.add( 'is-error' )
            feedback.textContent = form.dataset.error
        } finally {
            submit.classList.remove( 'is-loading' )
        }
    })
})
