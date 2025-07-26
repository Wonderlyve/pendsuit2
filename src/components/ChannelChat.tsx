
import { useState, useEffect } from 'react';
import { Send, ArrowLeft, Users, Crown, Lock, Smile, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChannelMessages } from '@/hooks/useChannelMessages';
import { useVipPronos } from '@/hooks/useVipPronos';
import { VipPronoModal } from '@/components/channel-chat/VipPronoModal';
import { VipPronoCard } from '@/components/channel-chat/VipPronoCard';
import MessageBubble from '@/components/channel-chat/MessageBubble';
import { supabase } from '@/integrations/supabase/client';

interface ChannelInfo {
  id: string;
  name: string;
  description: string;
  creator_id: string;
  creator_username?: string;
  creator_badge?: string;
  subscriber_count?: number;
}

interface ChannelChatProps {
  channelId: string;
  channelName: string;
  onBack: () => void;
}

const ChannelChat = ({ channelId, channelName, onBack }: ChannelChatProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showVipPronoModal, setShowVipPronoModal] = useState(false);

  // Fetch channel info first, then use it to initialize the messages hook
  useEffect(() => {
    const fetchChannelInfo = async () => {
      try {
        const { data: channelData, error: channelError } = await supabase
          .from('channels')
          .select('*')
          .eq('id', channelId)
          .single();

        if (channelError) throw channelError;

        // Get creator profile separately
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username, badge')
          .eq('user_id', channelData.creator_id)
          .single();

        const { count } = await supabase
          .from('channel_subscriptions')
          .select('*', { count: 'exact' })
          .eq('channel_id', channelId);

        setChannelInfo({
          ...channelData,
          creator_username: profileData?.username || 'Utilisateur',
          creator_badge: profileData?.badge,
          subscriber_count: count || 0
        });
      } catch (error) {
        console.error('Error fetching channel info:', error);
      }
    };

    fetchChannelInfo();
  }, [channelId]);

  const { messages, loading, isCreator, sendMessage: sendChannelMessage } = useChannelMessages(
    channelId, 
    channelInfo?.creator_id || ''
  );

  const { pronos, loading: pronosLoading, createVipProno } = useVipPronos(channelId);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    const success = await sendChannelMessage(newMessage);
    if (success) {
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '⛹️', '🤺', '🤾', '🏌️', '🏇', '🧘', '🏄', '🏊', '🤽', '🚣', '🧗', '🚵', '🚴', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️', '🎫', '🎟️', '🎪', '🤹', '🎭', '🩰', '🎨', '🎬', '🎤', '🎧', '🎼', '🎵', '🎶', '🥳', '🎉', '🎊', '🎈', '🎁', '🎀', '🎂', '🍰', '🧁', '🍪', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '☕', '🫖', '🍵', '🧃', '🥤', '🧋', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧉', '🍾', '🧊', '🥄', '🍴', '🍽️', '🥢', '🔥', '💯', '💢', '💥', '💫', '💦', '💨', '🕳️', '💣', '💬', '👁️‍🗨️', '🗨️', '🗯️', '💭', '💤'];

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleCreateVipProno = async (pronoData: any) => {
    const success = await createVipProno({
      ...pronoData,
      channelId
    });
    
    if (success) {
      setShowVipPronoModal(false);
    }
    
    return success;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">{channelName}</h1>
            <div className="flex items-center text-sm text-gray-500 space-x-3">
              <div className="flex items-center">
                <Lock className="w-3 h-3 mr-1" />
                Canal VIP
              </div>
              {channelInfo && (
                <div className="flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  {channelInfo.subscriber_count} abonnés
                </div>
              )}
            </div>
          </div>
          {channelInfo && (
            <div className="flex items-center space-x-2">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${channelInfo.creator_id}`}
                alt="Creator"
                className="w-8 h-8 rounded-full"
              />
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium">{channelInfo.creator_username}</span>
                  {channelInfo.creator_badge && (
                    <Crown className="w-3 h-3 text-yellow-500" />
                  )}
                </div>
                <span className="text-xs text-gray-500">Créateur</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1">
        <ScrollArea className="h-full px-4 py-4">
          <div className="space-y-4">
            {/* VIP Pronos Section */}
            {!pronosLoading && pronos.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-yellow-700 flex items-center">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  Pronos VIP
                </h3>
                {pronos.map((prono) => (
                  <VipPronoCard key={prono.id} prono={prono} />
                ))}
              </div>
            )}

            {/* Messages Section */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Chargement des messages...</p>
              </div>
            ) : (
              <>
                {messages.length === 0 && pronos.length === 0 ? (
                  <div className="text-center py-12">
                    <Lock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun contenu pour le moment</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {isCreator ? 'Partagez du contenu exclusif avec vos abonnés !' : 'Attendez que le créateur partage du contenu'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.length > 0 && (
                      <>
                        <h3 className="text-sm font-medium text-gray-700">Messages</h3>
                        {messages.map((message) => (
                          <MessageBubble
                            key={message.id}
                            message={message}
                            isCreator={isCreator}
                            creatorId={channelInfo?.creator_id}
                          />
                        ))}
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        {isCreator ? (
          <div className="space-y-2">
            {/* VIP Prono Button */}
            <div className="flex justify-center mb-2">
              <Button
                onClick={() => setShowVipPronoModal(true)}
                variant="outline"
                className="bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
              >
                <Star className="w-4 h-4 mr-2 fill-current" />
                Créer un Prono VIP
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Input
                  placeholder="Partagez du contenu exclusif avec vos abonnés..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pr-10"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <Smile className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-green-500 hover:bg-green-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            {showEmojiPicker && (
              <div className="bg-white border border-gray-200 rounded-lg p-3 max-h-32 overflow-y-auto">
                <div className="grid grid-cols-8 gap-1">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => addEmoji(emoji)}
                      className="text-lg hover:bg-gray-100 rounded p-1 transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-2">
            <div className="flex items-center justify-center space-x-2 text-gray-500">
              <Lock className="w-4 h-4" />
              <span className="text-sm">Seul le créateur peut publier dans ce canal</span>
            </div>
          </div>
        )}
      </div>

      {/* VIP Prono Modal */}
      <VipPronoModal
        isOpen={showVipPronoModal}
        onClose={() => setShowVipPronoModal(false)}
        onSubmit={handleCreateVipProno}
      />
    </div>
  );
};

export default ChannelChat;
