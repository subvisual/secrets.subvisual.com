<script>
    // @ts-nocheck
  
    import Button from "../components/Button.svelte";

  
    let menuOpen = false;
    let inputValue = "";
    $: console.log(inputValue);
  
    const menuItems = ["6 hours", "1 hour", "30 min", "15 min"];
    let filteredItems = [];
  
  </script>
  
  <p align="center">
    Secret is revealed and is now permanently deleted from the system.
  </p>
  <div align="center">
    <section class="dropdown">
      <div>
        <textarea placeholder="Write your information here..." />
      </div>
      <div class="actions">

      </div>
    </section>
  </div>
  
  <style>
    p {
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      font-weight: 400;
      line-height: 28px;
      text-align: center;
    }
    textarea {
      width: 880px;
      height: 267px;
      border: 1px solid #f8fbfd;
      border-radius: 20px 20px 0 0;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.16);
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      color: #729cc5;
      line-height: 24px;
      text-align: left;
      padding: 30px;
      resize: none;
    }
    .actions {
      width: 880px;
      height: 70px;
      border: 1px solid #f8fbfd;
      border-radius: 0 0 20px 20px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.16);
      padding: 30px;
      background-color: white;
    }
    .dropdown {
      position: relative;
      display: inline-block;
    }

  </style>
  