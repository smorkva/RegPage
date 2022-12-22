<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Channels\SMSChannel;
use App\Models\User;

class RegisteredUser extends Notification
{
    use Queueable;

    protected $user;
    protected $password;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(User $user, $password)
    {
        $this->user = $user;
        $this->password = $password;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail', SMSChannel::class];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->greeting('Hello, '.$this->user->name)
            ->line('Welcome to Application.')
            ->line("Your password \"$this->password\".")
            ->action('Explore', url('/'))
            ->line('Thank you for using our application!');
    }

    public function toSMS($notifiable)
    {
        return 'Hello, '.$this->user->name.' '.
            'Welcome to Application. '.
            "Your password \"$this->password\". ".
            'Thank you for using our application!';
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
