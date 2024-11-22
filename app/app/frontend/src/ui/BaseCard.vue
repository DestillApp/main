<template>
    <!-- The root element of the card component, providing a styled container for its content -->
    <div class="card">
        <!-- Slot to display the content passed to the card component -->
        <slot></slot>
    </div>
</template>

<script>
/**
 * @component BaseCard
 * @description A custom card component that provides a styled container for its content. The content is passed through a slot.
 */
export default {
    setup() {
       // The setup function is empty as this component does not require reactive data, methods, or lifecycle hooks.
    },
}
</script>

<style scoped>
.card {
    width: 80%;
    background-color: white;
    box-shadow: var(--box-shadow);
    border-radius: var(--card-border-radius);
    margin-top: 30px;
    margin-bottom: 30px;
    margin-right: 10vw; 
    margin-left: 10vw;
    padding-top: 20px;
    padding-bottom: 20px;
    padding-right: 30px;
    padding-left: 30px;
}
</style>