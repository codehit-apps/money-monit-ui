<template>
  <footer>
    <div class="container text-muted">
      <div class="pt-4 pb-4">
        <ul>
          <li><a target="_blank" href="https://codehit.net/#/privacy">Privacy Policy</a></li>
          <li><a target="_blank" href="https://codehit.net/#/contact">Contact Us</a></li>
        </ul>
        <p class="mb-0">
          Copyright © 2020 CodeHit. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
}
</script>

<style>
  footer {
    background-color: #f7f7f7;
    font-size: .875rem;
  }
  footer  ul {
    padding-left: 0;
  }
  footer  ul li {
    display: inline-block;
  }
  footer ul li a {
    font-weight: 600;
    color: #495057;
  }
  footer ul li+li {
    margin-left: 1rem;
  }
</style>