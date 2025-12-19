# Running Linux in Headless Mode

If you're connecting via SSH and don't need a graphical interface (GUI), you can switch your system to headless (text-only) mode to save resources. Follow these steps:

1. **Check the current default target (runlevel):**
   ```bash
   systemctl get-default
   ```

2. **Set the default target to text mode (`multi-user.target`):**
   ```bash
   sudo systemctl set-default multi-user.target
   ```

3. **Disable the graphical display manager:**  
   (Choose the appropriate command based on your system.)

   - For systems using `gdm3` (GNOME Display Manager):
     ```bash
     sudo systemctl disable gdm3
     ```
   - For systems using `lightdm`:
     ```bash
     sudo systemctl disable lightdm
     ```

4. **Reboot your system for the changes to take effect:**
   ```bash
   sudo reboot
   ```

_Note: After rebooting, your machine will start without launching the GUI, providing a pure command-line environment. To restore the GUI later, you can set the default target back to `graphical.target` and re-enable your display manager._